'use strict';

import { Command } from 'axoncore';

class Add extends Command {
    constructor(module) {
        super(module);

        this.label = 'add';
        this.aliases = ['add'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss add',
            description: 'Add rss feed.',
            usage: 'rss add [feed url] [channel]',
            examples: ['rss add http://feedurl/feed #general'],
        };

        this.options.argsMin = 2;
        this.options.cooldown = 10000;

        this.permissions.bot = ['manageWebhooks'];
        this.permissions.user.needed = ['manageGuild'];
        this.permissions.staff.needed = this.axon.staff.owners;
        this.permissions.serverAdmin = true;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        const channel = this.Resolver.channel(msg.channel.guild, args.slice(1));
        if (!channel) {
            return this.sendError(msg.channel, 'Ce channel n\'existe pas!');
        }
        if (!this.Utils.hasChannelPerms(channel, ['manageWebhooks'])) {
            return this.sendBotPerms(msg.channel, ['manageWebhooks']);
        }

        const res = await this.rssHandler.subscribeFeed(msg, args[0], msg.channel.guild, channel);

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien activé les RSS pour **${args[0]}** dans **${channel.name}**.`);
        }
        return;
    }
}

export default Add;
