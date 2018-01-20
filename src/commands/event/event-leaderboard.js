import {Command} from 'discord-akairo'
import GuildModel from '../../models/guild'
import SteamGroupModel from '../../models/steam-group'
import EventModel from '../../models/event'
import lapTimeFormatter from "../../formatters/lap-time";
import LeaderboardRepository from "../../repositories/leaderboard";
import SteamGroupRepository from "../../repositories/steam-group";
import MemberFilter from "../../filters/member";

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
                let steamGroupModel = await SteamGroupModel.findOne({guild: guildModel});
                let groupMembers = await new SteamGroupRepository(steamGroupModel.groupIdentifier, steamGroupModel.groupIdentifierType).fetchGroupMembers();
                let lapTimes = await new LeaderboardRepository(eventModel.trackId, eventModel.vehicleId).fetchLapTimes();
                let filteredLapTimes = new MemberFilter(groupMembers).filterLapTimes(lapTimes);
                let lapTmesMessage = lapTimeFormatter.formatLapTimes(filteredLapTimes);
                let eventMessage = eventModel.eventMessage;
                if (eventMessage == null) {
                    eventMessage = "You can se a message here. Ex: !tt-eventMessage \"YOUR_MESSAGE_HERE\""
                }
                message.channel.send(`${eventMessage} \n \`\`\`${lapTmesMessage}\`\`\``)
            }
        });
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = EventLeaderboard;