import Database from '@/lib/DatabaseManager'
import Form from './Form.model'
import FormStep from './FormStep.model'
import { UUID } from 'crypto'

export enum FormFieldTypes {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SINGLE_CHOICE = 'single_choice',
  YES_NO = 'yes_no',
  MULTI_CHOICE = 'multi_choice',
  DROPDOWN = 'dropdown',
  IMAGE_UPLOAD = 'image_upload',
  FILE_UPLOAD = 'file_upload',
  DRAW_OR_SIGNATURE = 'draw_or_signature',
  ARRAY = 'array',
  SCALE = 'scale',
  RATING = 'rating',
  DATE = 'date',
  TIME = 'time',
  HTML_BLOCK = 'html_block',
}

interface FormFieldAttributes {
  id: UUID
  field_name: string
  field_type: FormFieldTypes
  field_order?: number
  description?: string
  conditions?: []
  options?: any[]
  required: boolean
  created_at?: Date
  updated_at?: Date
  step: FormStep
}

class FormField {
  id: UUID
  field_name: string
  field_type: FormFieldTypes
  field_order?: number
  description?: string
  conditions?: any[]
  options?: any[]
  required: boolean
  created_at?: Date
  updated_at?: Date
  step: FormStep

  constructor (attributes: FormFieldAttributes) {
    this.id = attributes.id
    this.field_name = attributes.field_name
    this.field_type = attributes.field_type
    this.field_order = attributes.field_order
    this.description = attributes.description
    this.conditions = attributes.conditions
    this.options = attributes.options
    this.required = attributes.required
    this.created_at = attributes.created_at
    this.updated_at = attributes.updated_at
    this.step = attributes.step
  }

  static async getAll (): Promise<FormField[]> {
    const formFields = await Database.query('SELECT * FROM form_fields')
    return formFields.rows
  }

  static async findById (id: UUID): Promise<FormField | null> {
    const formField = await Database.query('SELECT * FROM form_fields WHERE id = $1', [id])
    if (formField.rows.length === 0) {
      return null
    }
    return new FormField(formField.rows[0])
  }

  static async findByFormStepId (stepId: UUID): Promise<FormField[]> {
    const formFields = await Database.query('SELECT * FROM form_fields WHERE step_id = $1 ORDER BY field_order ASC', [stepId])
    return formFields.rows
  }

  async create (): Promise<void> {
    await Database.query('INSERT INTO form_fields (id, field_name, field_type, description, conditions, options, required, step_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [this.id, this.field_name, this.field_type, this.description, this.conditions, this.options, this.required, this.step.id])
  }

  async update (): Promise<void> {
    await Database.query('UPDATE form_fields SET field_name = $1, field_type = $2, description = $3, conditions = $4, options = $5, required = $6, field_order = $7, updated_at = NOW(), step_id = $8 WHERE id = $9', [this.field_name, this.field_type, this.description, this.conditions, this.options, this.required, this.field_order, this.step.id, this.id])
  }

  async delete (): Promise<void> {
    await Database.query('DELETE FROM form_fields WHERE id = $1', [this.id])
  }

  async getStep (): Promise<FormStep> {
    return this.step
  }

  async getForm (): Promise<Form> {
    return await this.step.getForm()
  }

  async getOptions (): Promise<any> {
    return this.options
  }

  async addOption (option: any): Promise<void> {
    if (!this.options) this.options = []
    this.options.push(option)
  }

  async removeOption (option: any): Promise<void> {
    if (!this.options) return
    this.options = this.options.filter((opt: any) => opt !== option)
  }

  async addCondition (condition: any): Promise<void> {
    if (!this.conditions) this.conditions = []
    this.conditions.push(condition)
  }

  async removeCondition (condition: any): Promise<void> {
    if (!this.conditions) return
    this.conditions = this.conditions.filter((cond: any) => cond !== condition)
  }

  async updatePosition (position: number): Promise<void> {
    this.field_order = position
    await this.update()
  }
}

export default FormField
