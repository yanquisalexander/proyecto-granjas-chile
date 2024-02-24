import chalk from 'chalk'
import SiteSettings from '../models/SiteSettings'

export let siteSettings: SiteSettings | null = null

export const initializeSiteSettings = async (): Promise<void> => {
  if (!siteSettings) {
    siteSettings = SiteSettings.getInstance()
    await siteSettings.refreshSettings()
    console.log(chalk.green('Site settings initialized'))
  }
}
