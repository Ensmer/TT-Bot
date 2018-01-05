import config from './config'
import settings from '../settings.json'
import {AkairoClient} from 'discord-akairo'
import mongoose from 'mongoose'
import GuildModel from './model/GuildModel'

// Setup DB
mongoose.Promise = Promise;
mongoose.connect(config.dbPath, {keepAlive: 1});
mongoose.connection.on('error', () => {
    throw new Error(`Unable to connect to database: ${config.db}`)
});

// Setup Discord
const client = new AkairoClient({
    ownerID: settings.ownerId,
    prefix: settings.prefix,
    commandDirectory: './src/command/'
}, {});
client.login(settings.token).then(() => {
    console.log('Logged in!');
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