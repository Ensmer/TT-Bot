import {Command} from 'discord-akairo'
import GuildModel from '../../models/guild'
import SteamGroupModel from '../../models/steam-group'
import GroupIdentifierType from '../../constants/group-identifier-type'

class SteamGroupNameCommand extends Command {
    constructor() {
        super('steamGroupName', {
            aliases: ['steamGroupName', 'sgn'],
            channelRestriction: 'guild',
            category: 'steam',
            args: [
                {
                    id: 'name'
                }
            ]
        });
    }

    async exec(message, {name}) {
        let guildModel = await GuildModel.findOne({id: message.guild.id});
        await SteamGroupModel.findOne({guild: guildModel}).then((steamGroupModel) => {
            if (steamGroupModel == null) {
                steamGroupModel = new SteamGroupModel({
                    guild: guildModel,
                    groupIdentifier: name,
                    groupIdentifierType: GroupIdentifierType.NAME
                });
                steamGroupModel.save();
            } else {
                steamGroupModel.groupIdentifier = name;
                steamGroupModel.groupIdentifierType = GroupIdentifierType.NAME;
                steamGroupModel.save()
            }
            message.channel.send(`Group name is set to ${name}`)
        });
        if (guildModel.deleteCommands && message.deletable) {
            message.delete()
        }
    }
}

module.exports = SteamGroupNameCommand;