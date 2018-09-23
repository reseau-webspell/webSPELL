'use strict';

import { Command } from 'axoncore';

class Enable extends Command {
    constructor(module) {
        super(module);

        this.label = 'enable';
        this.aliases = ['enable'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss enable',
            description: 'Enable rss feed.',
            usage: 'rss enable [feed name] [channel]',
            examples: ['rss enable splashtoon #general'],
        };

        this.options.argsMin = 2;
        this.options.cooldown = 10000;

        this.permissions.bot = ['manageWebhooks'];
        this.permissions.user.needed = ['manageGuild'];
        this.permissions.serverAdmin = true;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        const api = this.rssHandler.apis.find(a => a.name && a.name.toLowerCase() === args[0].toLowerCase());
        if (!api) {
            return this.sendError(msg.channel, 'Ce feed n\'existe pas!');
        }

        const channel = this.Resolver.channel(msg.channel.guild, args.slice(1));
        if (!channel) {
            return this.sendError(msg.channel, 'Ce channel n\'existe pas!');
        }
        if (!this.AxonUtils.hasChannelPerms(channel, ['manageWebhooks'])) {
            return this.sendBotPerms(msg.channel, ['manageWebhooks']);
        }

        const res = await this.rssHandler.subscribeFeed(msg, api.url, msg.channel.guild, channel);

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien activé les RSS pour **${api.name || api.url}** dans **${channel.name}**.`);
        }
        return;
    }
}

export default Enable;
