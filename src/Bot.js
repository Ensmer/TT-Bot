import config from './config'
import auth from '../auth.json'
import Discord from 'discord.js'
import mongoose from 'mongoose'
import GuildModel from './model/GuildModel'
import LeaderboardRepository from './repository/LeaderboardRepository'
import SteamGroupRepository from './repository/SteamGroupRepository'
import MemberFilter from './filter/MemberFilter'
import GroupIdentifierType from './common/GroupIdentifierType'
import lapTimeFormatter from './formatter/LapTimeFormatter'

// Bot Constants
const BOT_PREFIX = '!tt-';

// Setup Discord
const client = new Discord.Client();
client.login(auth.token);

// Setup DB
mongoose.Promise = Promise;
mongoose.connect(config.dbPath, {keepAlive: 1});
mongoose.connection.on('error', () => {
    throw new Error(`Unable to connect to database: ${config.db}`)
});

// Events
client.on('ready', () => {
    console.log('I am ready!');
    client.guilds.array().forEach(((guild) => {
        checkGuild(guild);
    }))
});

client.on('guildCreate', async (guild) => {
    checkGuild(guild)
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

// Guild DB Control
const checkGuild = async (guild) => {
    await GuildModel.findOne({id: guild.id}).then((guildModel) => {
        if (guildModel == null) {
            guildModel = new GuildModel({
                id: guild.id
            });
            guildModel.save();
        }
    });
};

// Event Handlers
const leaderboardEvent = async (message) => {
    let lapTimes = await new LeaderboardRepository(3934256239, 3293397987).fetchLapTimes();
    message.channel.send(lapTimeFormatter.formatLapTimes(lapTimes))
};

const groupNameEvent = async (message) => {
    message.channel.send("Group name is set!")
};

const filteredEvent = async (message) => {
    let groupMembers = await new SteamGroupRepository("ProjectCarsDriversClub", GroupIdentifierType.NAME).fetchGroupMembers();
    let lapTimes = await new LeaderboardRepository(3934256239, 3293397987).fetchLapTimes();
    let filteredLapTimes = new MemberFilter(groupMembers).filterLapTimes(lapTimes);
    let response = lapTimeFormatter.formatLapTimes(filteredLapTimes);
    message.channel.send(response)
};