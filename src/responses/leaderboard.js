import LeaderboardRepository from "../repositories/leaderboard";
import SteamGroupRepository from "../repositories/steam-group";
import SteamGroupModel from "../models/steam-group";
import MemberFilter from "../filters/member";
import lapTimeFormatter from "../formatters/lap-time";


const send = async(channel, guildModel, eventModel) => {
    let steamGroupModel = await SteamGroupModel.findOne({guild: guildModel});
    let groupMembers = await new SteamGroupRepository(steamGroupModel.groupIdentifier, steamGroupModel.groupIdentifierType).fetchGroupMembers();
    let lapTimes = await new LeaderboardRepository(eventModel.trackId, eventModel.vehicleId).fetchLapTimes();
    let filteredLapTimes = new MemberFilter(groupMembers).filterLapTimes(lapTimes);
    let lapTmesMessage = lapTimeFormatter.formatLapTimes(filteredLapTimes);
    let eventMessage = eventModel.eventMessage;
    if (eventMessage == null) {
        eventMessage = "You can se a message here. Ex: !tt-eventMessage \"YOUR_MESSAGE_HERE\""
    }
    channel.send(`${eventMessage} \n \`\`\`${lapTmesMessage}\`\`\``)
};

module.exports = send;