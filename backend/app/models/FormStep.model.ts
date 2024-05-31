import Database from '@/lib/DatabaseManager'
import { UUID } from 'crypto'
import Form from '@/app/models/Form.model'
import FormField from './FormField.model'
import { dbService } from "../services/Database"
import { FormStepsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export interface FormStepAttributes {
  id: UUID
  title: string
  description?: string
  created_at?: Date
  updated_at?: Date
  form: Form
  fields?: FormField[]
  step_order?: number
}

class FormStep {
  id: UUID
  title: string
  description?: string
  created_at?: Date
  updated_at?: Date
  form: Form
  fields?: FormField[]
  step_order?: number

  constructor (attributes: FormStepAttributes) {
    this.id = attributes.id
    this.title = attributes.title
    this.description = attributes.description
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.form = attributes.form
    this.fields = attributes.fields
    this.step_order = attributes.step_order
  }

  static async findById (id: UUID): Promise<FormStep | null> {
    const formStep = await Database.query('SELECT * FROM form_steps WHERE id = $1', [id])
    if (formStep.rows.length === 0) {
      return null
    }
    return new FormStep(formStep.rows[0])
  }

  static async findByFormId (formId: string): Promise<FormStep[]> {
    const formSteps = await Database.query('SELECT * FROM form_steps WHERE form_id = $1 ORDER BY step_order', [formId])
    const steps = formSteps.rows.map(step => new FormStep(step))
    return steps
  }

  async create (): Promise<void> {
    await Database.query('INSERT INTO form_steps (id, title, description, form_id) VALUES ($1, $2, $3, $4)', [this.id, this.title, this.description, this.form.id])
  }

  async update (): Promise<void> {
    console.log('Updating form step', this.id)
    console.log('Form ID', this.form)
    await dbService.insert(FormStepsTable)
      .values({
        id: this.id,
        title: this.title,
        description: this.description,
        form_id: this.form.id,
        step_order: this.step_order
      }).onConflictDoUpdate({
        target: [FormStepsTable.id],
        set: {
          title: this.title,
          description: this.description,
          form_id: this.form.id,
          step_order: this.step_order
        }
      })
  }

  async updateOrder (order: number): Promise<void> {
    await Database.query('UPDATE form_steps SET step_order = $1 WHERE id = $2', [order, this.id])
  }

  async getFields (): Promise<FormField[]> {
    return await FormField.findByFormStepId(this.id)
  }

  async getForm (): Promise<Form> {
    const form = await Form.findById(this.form.id)
    if (!form) throw new Error('Form not found')
    return form
  }

  async delete (): Promise<void> {
    await Database.query('DELETE FROM form_steps WHERE id = $1', [this.id])
  }

  async addField (field: FormField): Promise<void> {
    await Database.query('INSERT INTO form_step_fields (form_step_id, form_field_id) VALUES ($1, $2)', [this.id, field.id])
  }

  async removeField (field: FormField): Promise<void> {
    await Database.query('DELETE FROM form_fields WHERE id = $1', [field.id])
  }

  static async addStep (form: Form, step: FormStep): Promise<void> {
    await Database.query('INSERT INTO form_steps (id, title, description, form_id) VALUES ($1, $2, $3, $4)', [step.id, step.title, step.description, form.id])
  }

  static async removeStep (form: Form, step: FormStep): Promise<void> {
    await Database.query('DELETE FROM form_steps WHERE id = $1', [step.id])
  }

  static async updateStep (form: Form, step: FormStep): Promise<void> {
    await Database.query('UPDATE form_steps SET title = $1, description = $2 WHERE id = $3', [step.title, step.description, step.id])
  }
}

export default FormStep
