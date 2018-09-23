'use strict';

import { Command } from 'axoncore';

class Prefix extends Command {
    constructor(module) {
        super(module);

        this.label = 'prefix';
        this.aliases = ['prefix'];

        this.infos = {
            owner: ['KhaaZ'],
            name: 'prefix',
            description: 'See or change the guild prefix.',
            usage: 'prefix [prefix]',
            examples: ['prefix', 'prefix e!'],
        };

        this.serverBypass = true;
        this.permissions.bot = ['sendMessages'];
        this.permissions.user.needed = ['manageGuild'];
        this.permissions.staff.bypass = this.axon.staff.owners;

        this.options.argsMin = 0;
        this.options.guildOnly = true;
    }

    execute({ msg, args, guildConf }) {
        const prefix = (guildConf.prefix.length ? guildConf.prefix : this.axon.params.prefix)[0];

        if (args[0]) {
            const newPrefix = args[0];

            this.axon.registerGuildPrefix(msg.channel.guild.id, [newPrefix]);
            return this.sendSuccess(msg.channel, `Nouveau prefix enregistré: \`${newPrefix}\``);
        }

        return this.sendMessage(msg.channel, `Le prefix est: \`${prefix}\``);
    }
}

export default Prefix;
