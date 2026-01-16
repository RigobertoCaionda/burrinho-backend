import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Player from "App/Models/Player";

export default class PlayersController {
    public async index({ response }: HttpContextContract) {
        const data = await Player.query()
        return response.ok(data)
    }

     public async show({ response, params }: HttpContextContract) {
        const id = params.id;
        const data = await Player.find(id)
        return response.ok(data)
    }

    public async update({ request, response }: HttpContextContract) {

        const data = request.all() 
        const player = await Player.findOrFail(data?.id)

        player.merge({ score: data?.score })
        await player.save()

        return response.ok(player)
    }
}
