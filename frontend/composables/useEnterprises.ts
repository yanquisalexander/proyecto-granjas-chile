import { useAuthenticatedRequest } from '~/composables/useAuthenticatedRequest';
import type { Enterprise } from "~/types";

/*
    This composable provides methods to interact with the enterprises Superadmin API.
    To check admin-only methods, see useSelfEnterprise.ts
*/

export const useEnterprises = () => {
    const client = useAuthenticatedRequest();

    const getEnterprises = async (): Promise<Enterprise[]> => {
        try {
            const response = await client.get('/admin/enterprises');
            return response.data;
        } catch (error) {
            // Handle error here (e.g., console.error, throw specific error)
            console.error('Error fetching enterprises:', error);
            return []; // Or return an empty array or handle differently
        }
    };

    const getEnterprise = async (id: string): Promise<Enterprise | null> => {
        try {
            const response = await client.get(`/admin/enterprises/${id}`);
            return response.data;
        } catch (error) {
            // Handle error here (e.g., console.error, throw specific error)
            console.error('Error fetching enterprise:', error);
            return null; // Or return null or handle differently
        }
    }

    const deleteEnterprise = async (id: string): Promise<void> => {
        try {
            await client.delete(`/admin/enterprises/${id}`);
        } catch (error) {
            // Handle error here (e.g., console.error, throw specific error)
            console.error('Error deleting enterprise:', error);
        }
    }

    const updateEnterprise = async (id: string, enterprise: Enterprise): Promise<void> => {
        try {
            await client.put(`/admin/enterprises/${id}`, enterprise);
        } catch (error) {
            // Handle error here (e.g., console.error, throw specific error)
            console.error('Error updating enterprise:', error);
        }
    }

    return {
        getEnterprises,
        deleteEnterprise,
        getEnterprise,
        updateEnterprise
    };
};