'use strict';

import Command from './../../../EaseCore/Command';

class Modules extends Command {

    constructor(module) {
        super(module);

        this.label = 'modules';
        this.aliases = ['modules'];

        this.infos = {
            owners: ['KhaaZ'],
            category: 'Admin',
            description: 'Manage modules',
            fullDesc: 'Enable/disable/list enabled modules in this guild',
            usage: ['modules', 'modules <module>'],
            example: ['modules', 'modules info']
        };
        
        this.serverBypass = true;
        this.permissions.bot = ['sendMessages'];
        this.permissions.perms.needed = ['manageGuild'];
        this.permissions.staff.bypass = this.bot.staff.owners;

        this.options.argsMin = 0;
        this.options.guildOnly = true;
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

export default Modules;
