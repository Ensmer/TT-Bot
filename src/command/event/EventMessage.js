import {Command} from "discord-akairo";
import EventModel from "../../model/EventModel";
import GuildModel from "../../model/GuildModel";

class EventMessage extends Command {
    constructor() {
        super('eventMessage', {
            aliases: ['eventMessage', 'eMessage', 'em'],
            channelRestriction: 'guild',
            category: 'event',
            args: [
                {
                    id: 'eventMessage'
                }
            ],
            split: 'quoted'
        });
    }

    async exec(message, {eventMessage}) {
        let guildModel = await GuildModel.findOne({id: message.guild.id});
        await EventModel.findOne({guild: guildModel}).then(async (eventModel) => {
            if (eventModel == null) {
                message.reply('Event could not be found, set an event first.')
            } else {
                eventModel.eventMessage = eventMessage;
                eventModel.save();
                message.reply('Event message is set.');
            }
        });
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = EventMessage;