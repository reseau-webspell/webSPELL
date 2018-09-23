'use strict';

import { Command } from 'axoncore';

class Update extends Command {
    constructor(module) {
        super(module);

        this.label = 'update';
        this.aliases = ['update'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss udpate',
            description: 'Udpate rss feed.',
            usage: 'rss update [feed url] (feed name) (image link)',
            examples: ['rss update http://www.khaaz.com/feed khaazfeed http://coolImage.png'],
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
        const feed = {};
        feed.url = args[0];
        if (args[1].startsWith('http')) {
            feed.image = args[1];
            feed.name = null;
        } else {
            feed.name = args[1];
            feed.image = null;
        }

        if (args[2] && args[2].startsWith('http')) {
            feed.image = args[2];
        } else if (args[2]) {
            feed.name = args[2];
        }

        const res = await this.rssHandler.updateApi(feed);

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien mis a jour l'API: **${args[0]}**.`);
        }
        return this.sendError(msg.channel, `Cette API n'existe pas: **${args[0]}**.`);
    }
}

export default Update;
