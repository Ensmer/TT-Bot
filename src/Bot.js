const auth = require('../auth.json');

const Discord = require('discord.js');
const client = new Discord.Client();

const LeaderboardRepository = require('./LeaderboardRepository');
const lapTimeFormatter = require('./LapTimeFormatter');

client.login(auth.token);

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === '!tt-leaderboard') {
        leaderboardEvent(message)
    }
});

const leaderboardEvent = async (message) => {
    let leaderboardRepository = new LeaderboardRepository(920145926, 728234598);
    let lapTimes = await leaderboardRepository.fetchLapTimes();
    let response = lapTimeFormatter.formatLapTimes(lapTimes);
    message.channel.send(response)
};