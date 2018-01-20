import {Command} from "discord-akairo";
import GuildModel from "../../models/guild";

class DeleteCommands extends Command {
    constructor() {
        super('updatesEnabled', {
            aliases: ['updatesEnabled', 'uEnabled', 'ue'],
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
            guildModel.updatesEnabled = true;
            final = 'true'
        } else {
            guildModel.updatesEnabled = false;
        }
        guildModel.save();
        message.channel.send(`Bot config updatesEnabled is set to ${final}.`);
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = DeleteCommands;