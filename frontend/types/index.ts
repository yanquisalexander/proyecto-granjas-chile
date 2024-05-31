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

export type EditedForm = {
    id:          string;
    title:       string;
    description?: string;
    form_status: string;
    workgroup:   Workgroup;
    steps:       Step[];
}

export type Step = {
    id:          string;
    title:       string;
    description?: string;
    created_at?:  Date;
    updated_at?:  Date;
    fields:      Field[];
    step_order?:  number;
}

export type Field = {
    id:          string;
    field_name:  string;
    field_type:  string;
    description: null | string;
    required:    boolean;
    created_at:  Date;
    updated_at:  Date;
    step_id:     string;
    field_order: number;
    conditions:  any[];
    options:     Options;
}

export type Options = {
    minLength?: number;
    maxLength?: number;
    min?:       number;
    max?:       number;
    maxImages?: number;

}

export type Workgroup = {
    id:         string;
    name:       string;
    enterprise: Enterprise;
}
