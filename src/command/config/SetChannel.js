import {Command} from "discord-akairo";
import GuildModel from "../../model/GuildModel";

class SetChannel extends Command {
    constructor() {
        super('setChannel', {
            aliases: ['setChannel', 'sChannel', 'here'],
            channelRestriction: 'guild',
            category: 'config',
            args: []
        });
    }

    async exec(message) {
        let guildModel = await GuildModel.findOne({id: message.guild.id});
        guildModel.channelId = message.channel.id;
        guildModel.save();
        message.channel.send(`Bot channel is set to #${message.channel.name}`)
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = SetChannel;