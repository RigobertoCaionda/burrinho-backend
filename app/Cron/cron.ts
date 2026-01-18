import { SixMinutesTask } from "./Tasks/SixMinutesTask";
import { ThreeMinutesTask } from "./Tasks/ThreeMinutesTask";
import cron from "node-cron";

export class CronManager {
  private threeMinutesTask: ThreeMinutesTask;
  private sixMinutesTask: SixMinutesTask;
  constructor() {
    this.threeMinutesTask = new ThreeMinutesTask();
    this.sixMinutesTask = new SixMinutesTask();
  }

  public startCronJobs() {
    // A cada 3 minutos
    cron.schedule("0 12 * * *", async () => {
      await this.threeMinutesTask.handle();
    });

    // A cada 6 minutos
    // cron.schedule('*/6 * * * *', async () => {
    //   await this.sixMinutesTask.handle()
    // })
  }
}
