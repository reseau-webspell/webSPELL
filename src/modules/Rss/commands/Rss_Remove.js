'use strict';

import { Command } from 'axoncore';

class Remove extends Command {
    constructor(module) {
        super(module);

        this.label = 'remove';
        this.aliases = ['remove'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss remove',
            description: 'Remove rss feed.',
            usage: 'rss remove [feed url | feed name]',
            examples: ['rss remove khaazFeed'],
        };

        this.options.argsMin = 1;
        this.options.cooldown = 10000;
        this.options.hidden = true;

        this.permissions.staff.needed = this.axon.staff.owners;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        const res = await this.rssHandler.deleteApi(args[0]);

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien supprimé une API: **${args[0]}**.`);
        }
        return this.sendError(msg.channel, `Cette API n'existe pas: **${args[0]}**.`);
    }
}

export default Remove;
