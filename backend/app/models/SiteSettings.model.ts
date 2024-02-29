import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import Database from '@/lib/DatabaseManager'

const __dirname = path.resolve()

interface SettingOptions {
  client?: boolean
  exposed_to_client?: boolean
  refresh?: boolean
  default: any
  min?: number
  max?: number
  regex?: string
  type?: string
  validator?: string
  allowed_values?: string[]
  readonly?: boolean
  hidden?: boolean
  secret?: boolean
}

type CategorySettings = Record<string, SettingOptions>

type SiteSettingsData = Record<string, CategorySettings>

class SiteSettings {
  private static instance: SiteSettings
  private readonly settings: SiteSettingsData

  private constructor () {
    this.settings = this.loadSettings()
  }

  public static getInstance (): SiteSettings {
    if (!SiteSettings.instance) {
      SiteSettings.instance = new SiteSettings()
    }
    return SiteSettings.instance
  }

  private loadSettings (): SiteSettingsData {
    const settingsPath = path.join(__dirname, 'config/site_settings.yml')
    let settings: SiteSettingsData = {}

    try {
      const fileContents = fs.readFileSync(settingsPath, 'utf8')
      settings = yaml.load(fileContents) as SiteSettingsData
    } catch (error) {
      console.error('Error loading site_settings.yml:', error)
    }

    return settings
  }

  private async initializeSettings (): Promise<void> {
    for (const category in this.settings) {
      const categorySettings = this.settings[category]
      for (const setting in categorySettings) {
        const options = categorySettings[setting]
        const { default: defaultValue } = options

        // Check if the setting exists in the database
        const result = await Database.query(
          'SELECT value FROM site_settings WHERE key = $1',
          [setting]
        )

        if (result.rowCount === 0) {
          // Setting not found in the database, insert default value
          await Database.query(
            'INSERT INTO site_settings (key, value) VALUES ($1, $2)',
            [setting, defaultValue]
          )
        }
      }
    }
  }

  public async refreshSettings (): Promise<void> {
    await this.initializeSettings()
  }

  public async getSetting (name: string): Promise<any> {
    const key = name
    const result = await Database.query('SELECT value FROM site_settings WHERE key = $1', [key])

    if (result.rowCount && result.rowCount > 0) {
      return result.rows[0].value
    }

    // Setting not found in the database, return default value
    for (const category in this.settings) {
      const categorySettings = this.settings[category]
      if (categorySettings[name]) {
        return categorySettings[name].default
      }
    }

    // If the setting is not found in any category, return undefined or handle as needed
    return undefined
  }

  public async updateSetting (name: string, value: any): Promise<void> {
    const key = name
    await Database.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, value]
    )
  }
}

export default SiteSettings
