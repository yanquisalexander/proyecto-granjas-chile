import { FormStatus } from "@/app/models/Form.model";
import { FormFieldTypes } from "@/app/models/FormField.model";
import { table } from "console";
import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable, uuid, boolean, primaryKey } from "drizzle-orm/pg-core";


export const EnterprisesTable = pgTable("enterprises", {
    id: uuid("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    company_logo: text("company_logo"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    deleted_at: timestamp("deleted_at"),
})

export const RolesTable = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    scopes: text("scopes").array()
})


export const UsersTable = pgTable("users", {
    id: uuid("id").notNull().primaryKey(),
    username: text("username").unique().notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    deleted_at: timestamp("deleted_at"),
    enterprise_id: uuid("enterprise_id").references(() => EnterprisesTable.id),
})
export const usersRelations = relations(UsersTable, ({ one, many }) => ({
    enterprise: one(EnterprisesTable, {
        fields: [UsersTable.enterprise_id],
        references: [EnterprisesTable.id],
    }),
    roles: many(RolesTable, {
       relationName: "user_roles",
    }),
}));


export const WorkGroupsTable = pgTable("work_groups", {
    id: uuid("id").primaryKey(),
    name: text("name").unique().notNull(),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    deleted_at: timestamp("deleted_at"),
    enterprise_id: uuid("enterprise_id").references(() => EnterprisesTable.id).notNull(),
})

export const WorkGroupMembersTable = pgTable("work_group_members", {
    user_id: uuid("user_id").references(() => UsersTable.id),
    work_group_id: uuid("work_group_id").references(() => WorkGroupsTable.id),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at")
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.user_id, table.work_group_id]})
    }
})

export const FormsTable = pgTable("forms", {
    id: uuid("id").primaryKey().notNull(),
    title: text("title").notNull(),
    description: text("description"),
    state: text("state").$type<FormStatus>().notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at"),
    work_group_id: uuid("work_group_id").references(() => WorkGroupsTable.id),
})

export const FormStepsTable = pgTable("form_steps", {
    id: uuid("id").primaryKey().notNull(),
    title: text("title"),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at"),
    form_id: uuid("form_id").references(() => FormsTable.id).notNull(),
})

export const FormFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey(),
    field_name: text("field_name"),
    field_type: text("field_type").$type<FormFieldTypes>(),
    description: text("description"),
    conditions: text("conditions").array(),
    options: text("options").array(),
    required: boolean("required"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    step_id: uuid("step_id").references(() => FormStepsTable.id).notNull(),
})

export const FormResponsesTable = pgTable("form_responses", {
    id: uuid("id").primaryKey(),
    response: text("response").array(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at"),
    form_id: uuid("form_id").references(() => FormsTable.id).notNull(),
    user_id: uuid("user_id").references(() => UsersTable.id).notNull(),
})

export const FormResponsesDraftsTable = pgTable("form_responses_drafts", {
    id: uuid("id").primaryKey(),
    response: text("response").array(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at"),
    form_id: uuid("form_id").references(() => FormsTable.id),
    user_id: uuid("user_id").references(() => UsersTable.id),
})

export const formRelations = relations(FormsTable, ({ one, many }) => ({
    workGroup: one(WorkGroupsTable, {
        fields: [FormsTable.work_group_id],
        references: [WorkGroupsTable.id]
    }),
    steps: many(FormStepsTable, {
        relationName: "steps",
    }),
    responses: many(FormResponsesTable, {
        relationName: "responses",
    }),
    drafts: many(FormResponsesDraftsTable, {
        relationName: "drafts",
    })
}))

export const workGroupRelations = relations(WorkGroupsTable, ({ one, many }) => ({
    enterprise: one(EnterprisesTable, {
        fields: [WorkGroupsTable.enterprise_id],
        references: [EnterprisesTable.id],
    }),
    members: many(WorkGroupMembersTable, {
        relationName: "members",
    }),
    forms: many(FormsTable, {
        relationName: "forms",
    })
}))

export const SiteSettingsTable = pgTable("site_settings", {
    id: serial("id").primaryKey(),
    key: text("key").unique(),
    value: text("value"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at")
})

export const UserRolesTable = pgTable("user_roles", {
    id: serial("id").primaryKey(),
    user_id: uuid("user_id").references(() => UsersTable.id),
    role_id: serial("role_id").references(() => RolesTable.id),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        // composite primary key
        pk: primaryKey({ columns: [table.user_id, table.role_id]})
    }
})


export const userRolesRelations = relations(UserRolesTable, ({ one, many }) => ({
    user: one(UsersTable, {
        fields: [UserRolesTable.user_id],
        references: [UsersTable.id],
    }),
    role: one(RolesTable, {
        fields: [UserRolesTable.role_id],
        references: [RolesTable.id],
    }),
}));

export const workGroupMembersRelations = relations(WorkGroupMembersTable, ({ one, many }) => ({
    user: one(UsersTable, {
        fields: [WorkGroupMembersTable.user_id],
        references: [UsersTable.id],
    }),
    workGroup: one(WorkGroupsTable, {
        fields: [WorkGroupMembersTable.work_group_id],
        references: [WorkGroupsTable.id],
    }),
}));