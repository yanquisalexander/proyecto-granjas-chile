import { dbService } from "../services/Database";
import { FormsTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import WorkGroup from './WorkGroup.model';
import FormStep from './FormStep.model';
import Enterprise from "./Enterprise.model";
import Database from "@/lib/DatabaseManager";

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

interface FormAttributes {
  id: string;
  title: string;
  form_status: FormStatus;
  custom_css?: string;
  created_at?: Date;
  updated_at?: Date;
  workgroup?: WorkGroup;
  steps?: FormStep[];
}

class Form {
  id: string;
  title: string;
  form_status: FormStatus;
  custom_css?: string;
  created_at?: Date;
  updated_at?: Date;
  workgroup?: WorkGroup;
  steps?: FormStep[];

  constructor(attributes: FormAttributes) {
    Object.assign(this, attributes);
    this.id = attributes.id;
    this.title = attributes.title;
    this.form_status = attributes.form_status;
  }

  static async getAll(): Promise<Form[]> {
    const forms = await dbService.query.FormsTable.findMany({
      columns: {
        work_group_id: false
      },
      with: {
        workGroup: {
          with: {
            enterprise: true,
          },
          columns: {
            enterprise_id: false,
            description: false,
            created_at: false,
            updated_at: false,
            deleted_at: false
          }
        }
      }
    });

    return forms.map(form => new Form({
      id: form.id,
      title: form.title,
      form_status: form.state,
      workgroup: form.workGroup ? new WorkGroup({
        id: form.workGroup.id,
        name: form.workGroup.name,
        enterprise: new Enterprise({
          id: form.workGroup.enterprise.id,
          name: form.workGroup.enterprise.name
        })
      }) : undefined,
    }));
  }

  static async findById(id: string): Promise<Form | null> {
    const form = await dbService.query.FormsTable.findFirst({
      where: eq(FormsTable.id, id),
      with: {
        workGroup: {
          with: {
            enterprise: true,
          },
          columns: {
            enterprise_id: false,
            description: false,
            created_at: false,
            updated_at: false,
            deleted_at: false
          }
        }
      }
    });

    return form ? new Form({
      id: form.id,
      title: form.title,
      form_status: form.state,
      workgroup: form.workGroup ? new WorkGroup({
        id: form.workGroup.id,
        name: form.workGroup.name,
        enterprise: new Enterprise({
          id: form.workGroup.enterprise.id,
          name: form.workGroup.enterprise.name
        })
      }) : undefined,
    }) : null;
  }

  static async findByWorkGroupId (workGroupId: string): Promise<Form[]> {
    const forms = await dbService.query.FormsTable.findMany({
      where: eq(FormsTable.work_group_id, workGroupId),
      with: {
        workGroup: {
          with: {
            enterprise: true,
          },
          columns: {
            enterprise_id: false,
            description: false,
            created_at: false,
            updated_at: false,
            deleted_at: false
          }
        }
      }
    })

    return forms.map(form => new Form({
      id: form.id,
      title: form.title,
      form_status: form.state,
      workgroup: form.workGroup ? new WorkGroup({
        id: form.workGroup.id,
        name: form.workGroup.name,
        enterprise: new Enterprise({
          id: form.workGroup.enterprise.id,
          name: form.workGroup.enterprise.name
        })
      }) : undefined,
    }))
  }

  static async getFormsToFill (workGroups: WorkGroup[]): Promise<Form[]> {
    const forms = await dbService.query.FormsTable.findMany({
      where: (
        inArray(FormsTable.work_group_id, workGroups.map(wg => wg.id)),
        eq(FormsTable.state, FormStatus.PUBLISHED)
    ),
      with: {
        workGroup: {
          with: {
            enterprise: true,
          },
          columns: {
            enterprise_id: false,
            description: false,
            created_at: false,
            updated_at: false,
            deleted_at: false
          }
        }
      }
    })

    const formsToFill = forms.filter(form => form.state === FormStatus.PUBLISHED)

    const formsToFillMapped = formsToFill.map(form => new Form({
      id: form.id,
      title: form.title,
      form_status: form.state,
      workgroup: form.workGroup ? new WorkGroup({
        id: form.workGroup.id,
        name: form.workGroup.name,
        enterprise: new Enterprise({
          id: form.workGroup.enterprise.id,
          name: form.workGroup.enterprise.name
        })
      }) : undefined,
    }))

    return formsToFillMapped
  }

  async create (): Promise<void> {
    try {
      const result = await dbService
        .insert(FormsTable)
        .values({
          id: this.id,
          title: this.title,
          state: this.form_status,
          work_group_id: this.workgroup?.id
        })
      if (!result) {
        throw new Error('Error creating form')
      }

    } catch (error) {
      throw new Error('Error creating form')
    }
  }

  async update (): Promise<void> {
    try {
      await dbService.update(FormsTable)
        .set({
          title: this.title,
          state: this.form_status,
        })
        .where(eq(FormsTable.id, this.id))
    } catch (error) {
      console.error(error)
      throw new Error('Error updating form')
    }
  }

  async delete (): Promise<void> {
    try {
      await dbService.delete(FormsTable)
        .where(eq(FormsTable.id, this.id))
    } catch (error) {
      console.error(error)
      throw new Error('Error deleting form')
    }
  }

  async getSteps (): Promise<FormStep[]> {
    return await FormStep.findByFormId(this.id)
  }

  async addStep (step: FormStep): Promise<void> {
    await FormStep.addStep(this, step)
  }

  async removeStep (step: FormStep): Promise<void> {
    await FormStep.removeStep(this, step)
  }

  async getWorkGroup (): Promise<WorkGroup> {
    if (!this.workgroup) throw new Error('This form does not have a workgroup associated')
    const workGroup = await WorkGroup.findById(this.workgroup.id)
    if (!workGroup) throw new Error('WorkGroup not found')
    return workGroup
  }

  async publish (): Promise<void> {
    this.form_status = FormStatus.PUBLISHED
    await this.update()
  }

  async archive (): Promise<void> {
    this.form_status = FormStatus.ARCHIVED
    await this.update()
  }

  async isPublished (): Promise<boolean> {
    return this.form_status === FormStatus.PUBLISHED
  }

  async isArchived (): Promise<boolean> {
    return this.form_status === FormStatus.ARCHIVED
  }

  async isDraft (): Promise<boolean> {
    return this.form_status === FormStatus.DRAFT
  }
}

export default Form
