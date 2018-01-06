import {Command} from 'discord-akairo'
import GuildModel from '../../model/GuildModel'
import SteamGroupModel from '../../model/SteamGroupModel'
import EventModel from '../../model/EventModel'
import lapTimeFormatter from "../../formatter/LapTimeFormatter";
import LeaderboardRepository from "../../repository/LeaderboardRepository";
import SteamGroupRepository from "../../repository/SteamGroupRepository";
import MemberFilter from "../../filter/MemberFilter";

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
    }
}

module.exports = EventLeaderboard;