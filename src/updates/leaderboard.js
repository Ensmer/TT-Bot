import settings from '../../settings.json'
import schedule from 'node-schedule'
import GuildModel from '../models/guild'
import EventModel from "../models/event";
import responseLeaderboard from '../responses/leaderboard'

const start = (client) => {
    let rule = new schedule.RecurrenceRule();
    rule.hour = settings.updateHour;

    schedule.scheduleJob(rule, () => {
        client.guilds.array().forEach((async (guild) => {
            let guildModel = await GuildModel.findOne({id: guild.id});
            if (guildModel.updatesEnabled && guildModel.channelId != null) {
                let channel = guild.channels.get(guildModel.channelId);
                await EventModel.findOne({guild: guildModel}).then(async (eventModel) => {
                    if (eventModel != null) {
                        responseLeaderboard(channel, guildModel, eventModel)
                    }
                });
            }
        }));
    })
};

module.exports.start = start;