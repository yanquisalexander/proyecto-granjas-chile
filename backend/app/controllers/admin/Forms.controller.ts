import { Request, Response, NextFunction } from 'express'
import Enterprise from '@/app/models/Enterprise.model'
import { UUID } from 'node:crypto'
import fs from 'fs'
import User from '@/app/models/User.model'
import Form from "@/app/models/Form.model"
import FormStep from "@/app/models/FormStep.model"
import FormField from "@/app/models/FormField.model"
import SocketIO from "@/app/modules/SocketIO.module"


export class AdminFormsController {
    async getForms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filterByStatus = req.query.status as string
            const user = await User.find(req.user.id)
            const userEnterprise = await user?.getEnterprise()
            if (!userEnterprise) {
                res.status(404).json({
                    message: 'This user does not have an enterprise associated.'
                })
                return
            }

            userEnterprise.getAdmins().then(admins => {
                if (!admins.find(admin => admin.id === req.user.id)) {
                    res.status(403).json({
                        message: 'You do not have permission to access this resource.'
                    })
                    return
                }
            })

            const forms = await userEnterprise.getForms()

            if (filterByStatus) {
                const filteredForms = forms.filter(form => form.form_status === filterByStatus)
                res.status(200).json({
                    forms: filteredForms
                })
                return
            }

            res.status(200).json({
                forms
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: (error as Error).message,
                error_type: (error as Error).name
            })
        }
    }

    async getForm(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const formId = req.params.formId
            const user = await User.find(req.user.id)
            const userEnterprise = await user?.getEnterprise()
            if (!userEnterprise) {
                res.status(404).json({
                    message: 'This user does not have an enterprise associated.'
                })
                return
            }

            const admins = await userEnterprise.getAdmins()
            const isUserAdmin = Boolean(admins.find(admin => admin.id === req.user.id))
            if (!isUserAdmin) {
                res.status(403).json({
                    message: 'You do not have permission to access this resource.'
                })
                return
            }

            const form = await Form.findById(formId)

            if (!form) {
                res.status(404).json({
                    message: 'Form not found.'
                })
                return
            }



            const steps = await form.getSteps()
            form.steps = steps

            const fields = await Promise.all(steps.map(async step => {
                const formFields = await step.getFields()
                return formFields
            }))
            form.steps = form.steps.map((step, index) => {
                step.fields = fields[index]
                return step
            })

            res.status(200).json(form)
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: (error as Error).message,
                error_type: (error as Error).name
            })
        }
    }

    async updateForm(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const formId = req.params.formId;
            const user = await User.find(req.user.id);
            const userEnterprise = await user?.getEnterprise();

            if (!userEnterprise) {
                return res.status(404).json({
                    message: 'This user does not have an enterprise associated.'
                });
            }

            const admins = await userEnterprise.getAdmins();

            if (!admins.find(admin => admin.id === req.user.id)) {
                return res.status(403).json({
                    message: 'You do not have permission to access this resource.'
                });
            }

            const form = await Form.findById(formId);
            const formSteps = await form?.getSteps();

            if (!form) {
                return res.status(404).json({
                    message: 'Form not found or unauthorized access.'
                });
            }

            // Actualiza los campos del formulario con los datos del cuerpo de la solicitud
            form.title = req.body.title || form.title;
            form.description = req.body.description || form.description;
            form.form_status = req.body.form_status || form.form_status;

            // Itera sobre los pasos del formulario
            await Promise.all(req.body.steps.map(async (bodyStep: any) => {
                let stepToUpdate = formSteps?.find(step => step.id === bodyStep.id);
                if (!stepToUpdate) {
                    stepToUpdate = new FormStep({
                        id: bodyStep.id,
                        title: bodyStep.title,
                        description: bodyStep.description,
                        step_order: bodyStep.step_order,
                        form
                    });
                    await stepToUpdate.create();
                } else {
                    stepToUpdate.title = bodyStep.title || stepToUpdate.title;
                    stepToUpdate.description = bodyStep.description || stepToUpdate.description;
                    stepToUpdate.form = form;
                    stepToUpdate.step_order = bodyStep.step_order || stepToUpdate.step_order;
                    await stepToUpdate.update();
                }

                // Obtener y actualizar los campos del paso
                stepToUpdate.fields = await stepToUpdate.getFields();
                await Promise.all(bodyStep.fields.map(async (bodyField: any) => {
                    let fieldToUpdate = stepToUpdate.fields?.find(field => field.id === bodyField.id);
                    if (!fieldToUpdate) {
                        fieldToUpdate = new FormField({
                            id: bodyField.id,
                            field_name: bodyField.field_name,
                            field_type: bodyField.field_type,
                            field_order: bodyField.field_order,
                            description: bodyField.description,
                            conditions: bodyField.conditions,
                            options: bodyField.options,
                            required: bodyField.required,
                            step: stepToUpdate
                        });
                        await fieldToUpdate.create();
                    } else {
                        // Create a new FormField object with the updated data
                        const updatedField = new FormField({
                            id: fieldToUpdate.id,
                            field_name: bodyField.field_name,
                            field_type: bodyField.field_type,
                            field_order: bodyField.field_order,
                            description: bodyField.description,
                            conditions: bodyField.conditions,
                            options: bodyField.options,
                            required: bodyField.required,
                            step: stepToUpdate
                        });

                        // Update the field in the database
                        await updatedField.update();
                    }
                }));

                // Elimina los campos que no están presentes en la solicitud
                await Promise.all(stepToUpdate.fields.filter(fieldToDelete => !bodyStep.fields.some((field: any) => field.id === fieldToDelete.id)).map(async (fieldToDelete) => {
                    await stepToUpdate.removeField(fieldToDelete);
                }));
            }));

            for (const formStep of formSteps ?? []) {
                if (!req.body.steps.some((step: any) => step.id === formStep.id)) {
                    try {
                        await formStep.delete();
                    } catch (error) {
                        console.error(error);
                        console.error('Error deleting step', formStep.id);
                    }
                }
            }

            // Actualiza el formulario en la base de datos
            await form.update();
            SocketIO.getInstance().emitEvent(`/forms/${form.id}`, 'form_updated', null);
            return res.status(200).json({
                message: 'Form updated successfully.'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: (error as Error).message,
                error_type: (error as Error).name
            });
        }
    }

    async createForm(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await User.find(req.user.id);
            const userEnterprise = await user?.getEnterprise();

            if (!userEnterprise) {
                return res.status(404).json({
                    message: 'This user does not have an enterprise associated.'
                });
            }

            const admins = await userEnterprise.getAdmins();

            if (!admins.find(admin => admin.id === req.user.id)) {
                return res.status(403).json({
                    message: 'You do not have permission to access this resource.'
                });
            }

            const formId = crypto.randomUUID();

            const form = new Form({
                id: formId,
                title: req.body.title,
                description: req.body.description,
                form_status: req.body.form_status,
                enterprise_id: userEnterprise.id
            });
            await form.create();


            return res.status(201).json({
                message: 'Form created successfully.'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: (error as Error).message,
                error_type: (error as Error).name
            });
        }
    }



}