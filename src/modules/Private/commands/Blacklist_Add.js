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
            cmdName: 'blacklist add',
            description: 'Add a user/guild to the blacklist.',
            examples: ['blacklist add 412348024526995457'],
            arguments: [['guildID OR userID', false]]
        };

        this.options.argsMin = 1;

        this.permissions.staff.needed = this.bot.staff.owners;
    }

    async execute({ msg, args }) {
        const guild = this.bot.guilds.get(args[0]);
        const user = guild || this.Resolver.user(this.bot, args);
        if (!user) {
            return this.sendError(msg.channel, 'This guild/user doesn\'t exist');
        }

        if (guild) {
            try {
                await this.bot.updateBlacklistGuild(guild.id, true);
                this.bot.Logger.info(`Blacklisted Guild: ${guild.name} - ${guild.id}`);
                return this.sendSuccess(msg.channel, `**${guild.name}**-[${guild.id}] was successfully blacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }

        if (user) {
            try {
                await this.bot.updateBlacklistUser(user.id, true);
                this.bot.Logger.info(`Blacklisted User: ${user.username}#${user.discriminator} - ${user.id}`);
                return this.sendSuccess(msg.channel, `User **${user.username}#${user.discriminator}**-[${user.id}] was successfully blacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }
    }
}

export default BlacklistAdd;
