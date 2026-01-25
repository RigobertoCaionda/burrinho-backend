import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class TestarCron extends BaseCommand {
  public static commandName = 'testar:cron'
  public static description = 'Comando para testar cronjob localmente'

  public async run() {
    console.log('✅ Cronjob executado às:', new Date().toISOString())
  }
}
