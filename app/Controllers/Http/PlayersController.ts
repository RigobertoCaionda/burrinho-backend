import Mail from "@ioc:Adonis/Addons/Mail";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Player from "App/Models/Player";
import Env from "@ioc:Adonis/Core/Env";
import View from "@ioc:Adonis/Core/View";

export default class PlayersController {
  public async index({ response }: HttpContextContract) {
    const data = await Player.query();
    return response.ok(data);
  }

  public async show({ response, params }: HttpContextContract) {
    const id = params.id;
    const data = await Player.find(id);
    return response.ok(data);
  }

  public async update({ request, response }: HttpContextContract) {
    const data = request.all();
    const player = await Player.findOrFail(data?.id);

    player.merge({ score: data?.score });
    await player.save();

    // Enviando email
    const html = await View.render("emails/winner", {
      playerName: player.name,
      score: player.score,
    });

    await Mail.send((message) => { // Existe também o sendlater que não envia imediatamente, mas aí precisa trabalhar com filas
      message
        .from(Env.get("SMTP_FROM_ADDRESS"), Env.get("SMTP_FROM_NAME"))
        .to(player.email)
        .subject("Você ganhou o jogo!")
        .html(html);
    });

    return response.ok(player);
  }
}
