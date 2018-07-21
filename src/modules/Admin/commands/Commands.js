'use strict';

import Command from './../../../EaseCore/Command';

class Commands extends Command {

    constructor(module) {
        super(module);

        this.label = 'commands';
        this.aliases = ['commands'];

        this.infos = {
            owners: ['KhaaZ'],
            category: 'Admin',
            description: 'Manage commands',
            fullDesc: 'Enable/disable/list enabled commands in this guild',
            usage: ['commands', 'commands <command>'],
            example: ['commands', 'commands ping']
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

export default Commands;
