'use strict';

import { Command } from 'axoncore';

class Push extends Command {
    constructor(module) {
        super(module);

        this.label = 'push';
        this.aliases = ['push'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss push',
            description: 'Push last news for a feed.',
            usage: 'rss push [feed name | feed url]',
            examples: ['rss push splashtoon'],
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
        if (!api.guilds[msg.channel.guild.id]) {
            return this.sendError(msg.channel, 'Vous n\'avez pas souscris a ce feed!');
        }

        const res = await this.rssHandler.pushLast(api.url, msg.channel.guild.id);
        if (!res) {
            return this.sendError(msg.channel, 'Vous n\'avez pas souscris a ce feed!');
        }
        return this.sendSuccess(msg.channel, `Vous avez force push la derniere news pour **${api.name || api.url}**.`);
    }
}

export default Push;
