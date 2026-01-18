import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import View from "@ioc:Adonis/Core/View";

export class ThreeMinutesTask {
  public async handle() {
     const html = await View.render("emails/winner", {
      playerName: 'Rigoberto Caionda',
      score: 10,
    });

    await Mail.send((message) => {
      message
        .from(Env.get("SMTP_FROM_ADDRESS"), Env.get("SMTP_FROM_NAME"))
        .to('rigobertocaionda98@gmail.com')
        .subject("Você ganhou o jogo!")
        .html(html);
    });
  }
}