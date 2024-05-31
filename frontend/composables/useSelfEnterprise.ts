import { useAuthenticatedRequest } from '~/composables/useAuthenticatedRequest';
import type { EditedForm, Enterprise } from "~/types";

/*
    This composable provides methods to interact with the user's enterprise. (Admins only)
*/

export const useSelfEnterprise = () => {
    const client = useAuthenticatedRequest();

    const getMyEnterprise = async (): Promise<Enterprise | null> => {
        try {
            const response = await client.get('/admin/my-enterprise');
            return response.data;
        } catch (error) {
            console.error('Error fetching enterprise:', error);
            //
            return null
        }
    };

    const getForms = async (status?: string): Promise<any[]> => {
        try {
            const response = await client.get('/admin/forms', {
                params: {
                    status
                }
            });
            return response.data.forms;
        } catch (error) {
            console.error('Error fetching forms:', error);
            //
            return []
        }
    }

    const getForm = async (formId: string): Promise<EditedForm> => {
        try {
            const response = await client.get(`/admin/forms/${formId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching form:', error);
            //
            return {} as EditedForm
        }
    }

    const updateForm = async (formId: string, form: EditedForm): Promise<void> => {
        try {
            await client.put(`/admin/forms/${formId}`, form);
        } catch (error) {
            console.error('Error updating form:', error);
            //
        }
    }

    const createForm = async (form: EditedForm): Promise<void> => {
        try {
            console.log(form);
            await client.post('/admin/forms', form);
        } catch (error) {
            console.error('Error creating form:', error);
            //
        }
    }



    return {
        getMyEnterprise,
        getForms,
        getForm,
        updateForm,
        createForm
    };
};