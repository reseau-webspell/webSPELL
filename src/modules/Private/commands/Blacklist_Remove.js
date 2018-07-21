'use strict';

import { Command } from 'axoncore';

class BlacklistRemove extends Command {

    constructor(module) {
        super(module);

        this.label = 'remove';
        this.aliases = ['remove', 'rm'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            cmdName: 'blacklist remove',
            description: 'Remove a user/guild from blacklist.',
            examples: ['blacklist remove 412348024526995457'],
            arguments: [['guildID OR userID', false]]
        };

        this.options.argsMin = 1;
        
        this.permissions.staff.needed = this.bot.staff.owners;
    }

    async execute({ msg, args }) {
        const guild = this.bot.guilds.get(args[0]);
        const user = guild || this.Resolver.user(this.bot, args);

        const black = !user ? /^[0-9]*$/.test(args[0]) && args[0] : null;

        if (!user && ! black) {
            return this.sendError(msg.channel, 'This guild/user doesn\'t exist');
        }

        if (guild) {
            try {
                await this.bot.updateBlacklistGuild(guild.id, false);
                this.bot.Logger.info(`Unblacklisted Guild: ${guild.name} - ${guild.id}`);
                return this.sendSuccess(msg.channel, `**${guild.name}**-[${guild.id}] was successfully unblacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }

        if (user) {
            try {
                await this.bot.updateBlacklistUser(user.id, false);
                this.bot.Logger.info(`Unblacklisted User: ${user.username}#${user.discriminator} - ${user.id}`);
                return this.sendSuccess(msg.channel, `User **${user.username}#${user.discriminator}**-[${user.id}] was successfully unblacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }

        if (black) {
            try {
                await this.bot.updateBlacklistGuild(black, false);
                await this.bot.updateBlacklistUser(black, false);
                this.bot.Logger.info(`Unblacklisted: ${black}`);
                return this.sendSuccess(msg.channel, `${black} was successfully unblacklisted!`);
            } catch (err) {
                return this.error(msg, err, 'internal');
            }
        }
    }
}

export default BlacklistRemove;
