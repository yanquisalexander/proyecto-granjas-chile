type EnterpriseAdmin = {
    id: string;
    email: string;
    username: string;
    name: string;
}

export type Enterprise = {
    id: string;
    name: string;
    location: string;
    company_logo: string;
    description: string;
    created_at: string;
    updated_at: string;
    admins?: EnterpriseAdmin[];
};
