'use strict';

import { Command } from 'axoncore';

import BlacklistAdd from './Blacklist_Add';
import BlacklistRemove from './Blacklist_Remove';

class Blacklist extends Command {
    constructor(module) {
        super(module);

        this.label = 'blacklist';
        this.aliases = ['blacklist'];

        this.hasSubcmd = true;
        this.subcmds = [BlacklistAdd, BlacklistRemove];

        this.infos = {
            owner: ['KhaaZ'],
            name: 'blacklist',
            description: 'Checks if a user/guild is blacklisted.',
            usage: 'blacklist [user/guild]',
            examples: ['blacklist 412348024526995457'],
        };

        this.options.argsMin = 1;

        this.permissions.staff.needed = this.axon.staff.owners;
        this.permissions.staff.bypass = this.axon.staff.owners;
    }

    async execute({ msg, args }) {
        const guild = this.bot.guilds.get(args[0]);
        const user = guild || this.Resolver.user(this.bot, args);

        const black = !user ? /^[0-9]*$/.test(args[0]) && args[0] : null;

        if (!user && !black) {
            return this.sendError(msg.channel, 'This guild/user doesn\'t exist');
        }

        let conf;
        try {
            conf = await this.axon.fetchAxonConf();
        } catch (err) {
            return this.error(msg, err, 'db');
        }

        if (guild) {
            return conf.bannedGuilds.includes(guild.id)
                ? this.sendMessage(msg.channel, `**${guild.name}**-[${guild.id}] is blacklisted! <:error:372786041637306368>`)
                : this.sendMessage(msg.channel, `**${guild.name}**-[${guild.id}] is not blacklisted! <:success:372785537221787658>`);
        }

        if (user) {
            return conf.bannedUsers.includes(user.id)
                ? this.sendMessage(msg.channel, `**${user.username}#${user.discriminator}**-[${user.id}] is blacklisted! <:error:372786041637306368>`)
                : this.sendMessage(msg.channel, `**${user.username}#${user.discriminator}**-[${user.id}] is not blacklisted! <:success:372785537221787658>`);
        }

        if (conf.bannedGuilds.includes(black)) {
            return this.sendMessage(msg.channel, `${black} is blacklisted! <:error:372786041637306368>`);
        }
        return this.sendMessage(msg.channel, `${black} is not blacklisted! <:success:372785537221787658>`);
    }
}

export default Blacklist;
