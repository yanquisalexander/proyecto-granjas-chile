export const useDashboard = () => {
    const client = useAuthenticatedRequest();

    const getProblems = async (): Promise<[]> => {
        try {
            const response = await client.get('/admin/dashboard/problems');
            return response.data;
        } catch (error) {
            // Handle error here (e.g., console.error, throw specific error)
            console.error('Error fetching problems:', error);
            return []; // Or return an empty array or handle differently
        }
    };

    return {
        getProblems
    };
}