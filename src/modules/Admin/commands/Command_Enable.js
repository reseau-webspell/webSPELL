'use strict';

import Command from './../../../EaseCore/Command';

class Enable extends Command {

    constructor(module) {
        super(module);

        this.label = 'enable';
        this.aliases = ['enable'];

        this.infos = {
            owner: ['KhaaZ'],
            cmdName: 'command enable',
            description: 'Enable a command in the guild.',
            examples: ['command enable prefix'],
            arguments: [['command', false]]
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

export default Enable;
