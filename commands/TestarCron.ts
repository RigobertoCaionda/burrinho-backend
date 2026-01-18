import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class TestarCron extends BaseCommand {
  public static commandName = 'testar:cron'
  public static description = 'Comando para testar cronjob localmente'

  public async run() {
    console.log('✅ Cron executado às:', new Date().toISOString())
  }
}
