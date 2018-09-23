'use strict';

import { Command } from 'axoncore';

class Disable extends Command {
    constructor(module) {
        super(module);

        this.label = 'disable';
        this.aliases = ['disable'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss disable',
            description: 'Disable rss feed.',
            usage: 'rss disable [feed name | feed url]',
            examples: ['rss disable splashtoon'],
        };

        this.options.argsMin = 1;
        this.options.cooldown = 10000;

        this.permissions.user.needed = ['manageGuild'];
        this.permissions.serverAdmin = true;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        const api = this.rssHandler.getAPI(args[0]);
        if (!api) {
            return this.sendError(msg.channel, 'Ce feed n\'existe pas!');
        }

        const res = await this.rssHandler.unsubscribeFeed(api.url, msg.channel.guild.id);

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien désactivé les RSS pour **${api.name || api.url}**.`);
        }
        return this.sendError(msg.channel, 'Ce feed est déja désactivé!');
    }
}

export default Disable;
