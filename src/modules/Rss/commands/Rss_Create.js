'use strict';

import { Command } from 'axoncore';

class Create extends Command {
    constructor(module) {
        super(module);

        this.label = 'create';
        this.aliases = ['create'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss create',
            description: 'Create rss feed.',
            usage: 'rss create [feed url] [feed name] [image link]',
            examples: ['rss create http://www.khaaz.com/feed khaazfeed http://coolImage.png'],
        };

        this.options.argsMin = 2;
        this.options.cooldown = 10000;
        this.options.hidden = true;

        this.permissions.staff.needed = this.axon.staff.owners;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        const feed = { url: args[0], name: args[1], image: args[2] || null };
        const res = await this.rssHandler.createApi(feed);

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien crée une API: **${args[1]}** pour **${args[0]}**.`);
        }
        return this.sendError(msg.channel, `Cette API existe déja: **${args[1]}** pour **${args[0]}**.`);
    }
}

export default Create;
