export class SixMinutesTask {
  public async handle() {
    console.log('📝 Job 2 rodou às:', new Date().toISOString())
  }
}