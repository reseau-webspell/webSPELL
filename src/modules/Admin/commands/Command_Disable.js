'use strict';

import Command from './../../../EaseCore/Command';

class Prefix extends Command {

    constructor(module) {
        super(module);

        this.label = 'prefix';
        this.aliases = ['prefix'];

        this.infos = {
            owner: ['KhaaZ'],
            cmdName: 'prefix',
            description: 'See or change the guild prefix.',
            examples: ['prefix', 'prefix e!'],
            arguments: [['prefix', true]]
        };
        
        this.serverBypass = true;
        this.permissions.bot = ['sendMessages'];
        this.permissions.perms.needed = ['manageGuild'];
        this.permissions.staff.bypass = this.bot.staff.owners;

        this.options.argsMin = 0;
    }

    execute({ msg, args, guildConf }) {
        
        const prefix = (guildConf.prefix.length ? guildConf.prefix : this.bot.params.prefix)[0];

        if (args[0]) {
            const newPrefix = args[0];

            this.bot.registerGuildPrefix(msg.channel.guild.id, [newPrefix]);
            return this.sendSuccess(msg.channel, `New prefix registered: \`${newPrefix}\``);
        }

        return this.sendMessage(msg.channel, `The prefix is: \`${prefix}\``);
    }
}

export default Prefix;
