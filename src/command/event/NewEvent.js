import {Command} from 'discord-akairo'
import GuildModel from '../../model/GuildModel'
import EventModel from '../../model/EventModel'

class NewEvent extends Command {
    constructor() {
        super('newEvent', {
            aliases: ['newEvent', 'nEvent', 'ne'],
            channelRestriction: 'guild',
            category: 'event',
            args: [
                {
                    id: 'trackId'
                },
                {
                    id: 'vehicleId'
                }
            ]
        });
    }

    async exec(message, {trackId, vehicleId}) {
        let guildModel = await GuildModel.findOne({id: message.guild.id});
        await EventModel.findOne({guild: guildModel}).then((eventModel) => {
            if (eventModel == null) {
                eventModel = new EventModel({
                    guild: guildModel,
                    trackId: trackId,
                    vehicleId: vehicleId
                });
                eventModel.save();
            } else {
                eventModel.trackId = trackId;
                eventModel.vehicleId = vehicleId;
                eventModel.save()
            }
            message.channel.send(`New event: Track = ${trackId}, Vehicle = ${vehicleId}`)
        });
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = NewEvent;