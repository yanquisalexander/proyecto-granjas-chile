import Database from '@/lib/DatabaseManager'
import { UUID } from 'crypto'
import WorkGroup from './WorkGroup.model'
import FormStep from './FormStep.model'

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

interface FormAttributes {
  id: UUID
  title: string
  form_status: FormStatus
  custom_css?: string
  created_at?: Date
  updated_at?: Date
  workgroup: WorkGroup
  steps?: FormStep[]
}

class Form {
  id: UUID
  title: string
  form_status: FormStatus
  custom_css?: string
  created_at?: Date
  updated_at?: Date
  workgroup: WorkGroup
  steps?: FormStep[]

  constructor (attributes: FormAttributes) {
    this.id = attributes.id
    this.title = attributes.title
    this.form_status = attributes.form_status
    this.custom_css = attributes.custom_css
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.workgroup = attributes.workgroup
    this.steps = attributes.steps
  }

  static async getAll (): Promise<Form[]> {
    const forms = await Database.query('SELECT * FROM forms')
    return forms.rows
  }

  static async findById (id: UUID): Promise<Form | null> {
    const form = await Database.query('SELECT * FROM forms WHERE id = $1', [id])
    if (form.rows.length === 0) {
      return null
    }
    return new Form(form.rows[0])
  }

  static async findByWorkGroupId (workGroupId: UUID): Promise<Form[]> {
    const forms = await Database.query('SELECT * FROM forms WHERE work_group_id = $1', [workGroupId])
    return forms.rows
  }

  async create (): Promise<void> {
    await Database.query('INSERT INTO forms (id, title, form_status, custom_css, work_group_id) VALUES ($1, $2, $3, $4, $5)', [this.id, this.title, this.form_status, this.custom_css, this.workgroup.id])
  }

  async update (): Promise<void> {
    await Database.query('UPDATE forms SET title = $1, form_status = $2, custom_css = $3 WHERE id = $4', [this.title, this.form_status, this.custom_css, this.id])
  }

  async delete (): Promise<void> {
    await Database.query('DELETE FROM forms WHERE id = $1', [this.id])
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
