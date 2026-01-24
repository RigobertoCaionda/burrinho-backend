export class SixMinutesTask {
  public async handle() {
    console.log('📝 Job rodou às:', new Date().toISOString())
  }
}