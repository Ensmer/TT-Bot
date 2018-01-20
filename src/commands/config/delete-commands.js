import {Command} from "discord-akairo";
import GuildModel from "../../models/guild";

class DeleteCommands extends Command {
    constructor() {
        super('deleteCommands', {
            aliases: ['deleteCommands', 'dCommands', 'dc'],
            channelRestriction: 'guild',
            category: 'config',
            args: [
                {
                    id: 'value'
                }
            ]
        });
    }

    async exec(message, {value}) {
        let guildModel = await GuildModel.findOne({id: message.guild.id});
        let final = 'false';
        if (value == 'true') {
            guildModel.deleteCommands = true;
            final = 'true'
        } else {
            guildModel.deleteCommands = false;
            final = 'false'
        }
        guildModel.save();
        message.channel.send(`Bot config deleteCommands is set to ${final}.`)
    }
}

module.exports = DeleteCommands;