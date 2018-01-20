import {Command} from 'discord-akairo'
import GuildModel from '../../models/guild'
import EventModel from '../../models/event'
import responseLeaderboard from '../../responses/leaderboard'

class EventLeaderboard extends Command {
    constructor() {
        super('eventLeaderboard', {
            aliases: ['eventLeaderboard', 'eLeaderboard', 'el'],
            channelRestriction: 'guild',
            category: 'event',
            args: []
        });
    }

    async exec(message) {
        let guildModel = await GuildModel.findOne({id: message.guild.id});
        await EventModel.findOne({guild: guildModel}).then(async (eventModel) => {
            if (eventModel == null) {
                message.reply('Event could not be found, set an event first.')
            } else {
                responseLeaderboard(message.channel, guildModel, eventModel)
            }
        });
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = EventLeaderboard;