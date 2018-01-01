import auth from '../auth.json'
import Discord from 'discord.js'
import LeaderboardRepository from './repository/LeaderboardRepository'
import SteamGroupRepository from './repository/SteamGroupRepository'
import MemberFilter from './filter/MemberFilter'
import GroupIdentifierType from './common/GroupIdentifierType'
import lapTimeFormatter from './formatter/LapTimeFormatter'

const client = new Discord.Client();
const BOT_PREFIX = '!tt-';

client.login(auth.token);

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === BOT_PREFIX + 'leaderboard') {
        leaderboardEvent(message)
    } else if (message.content === BOT_PREFIX + 'groupName') {
        groupNameEvent(message)
    } else if (message.content === BOT_PREFIX + 'filtered') {
        filteredEvent(message)
    }
});

const leaderboardEvent = async (message) => {
    let lapTimes = await new LeaderboardRepository(354022214, 1106819298).fetchLapTimes();
    message.channel.send(lapTimeFormatter.formatLapTimes(lapTimes))
};

const groupNameEvent = async (message) => {
    message.channel.send("Group name is set!")
};

const filteredEvent = async (message) => {
    let groupMembers = await new SteamGroupRepository("ProjectCarsDriversClub", GroupIdentifierType.NAME).fetchGroupMembers();
    let lapTimes = await new LeaderboardRepository(354022214, 1106819298).fetchLapTimes();
    let filteredLapTimes = new MemberFilter(groupMembers).filterLapTimes(lapTimes);
    let response = lapTimeFormatter.formatLapTimes(filteredLapTimes);
    message.channel.send(response)
};