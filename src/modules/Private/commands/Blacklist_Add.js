'use strict';

import { Command } from 'axoncore';

class BlacklistAdd extends Command {
    constructor(module) {
        super(module);

        this.label = 'add';
        this.aliases = ['add'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            ame: 'blacklist add',
            description: 'Add a user/guild to the blacklist.',
            usage: 'blacklist add [user/guild]',
            examples: ['blacklist add 412348024526995457'],
        };

        this.options.argsMin = 1;

        this.permissions.staff.needed = this.axon.staff.owners;
        this.permissions.staff.bypass = this.axon.staff.owners;
    }

    async execute({ msg, args }) {
        const guild = this.bot.guilds.get(args[0]);
        const user = guild || this.Resolver.user(this.bot, args);
        if (!user) {
            return this.sendError(msg.channel, 'This guild/user doesn\'t exist');
        }

        if (guild) {
            try {
                await this.axon.updateBlacklistGuild(guild.id, true);
                this.Logger.info(`Blacklisted Guild: ${guild.name} - ${guild.id}`);
                return this.sendSuccess(msg.channel, `**${guild.name}**-[${guild.id}] was successfully blacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }

        if (user) {
            try {
                await this.axon.updateBlacklistUser(user.id, true);
                this.Logger.info(`Blacklisted User: ${user.username}#${user.discriminator} - ${user.id}`);
                return this.sendSuccess(msg.channel, `User **${user.username}#${user.discriminator}**-[${user.id}] was successfully blacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }
    }
}

export default BlacklistAdd;
