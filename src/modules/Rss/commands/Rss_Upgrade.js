'use strict';

import { Command } from 'axoncore';

class Upgrade extends Command {
    constructor(module) {
        super(module);

        this.label = 'upgrade';
        this.aliases = ['upgrade'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss upgrade',
            description: 'Upgrade rss feed.',
            usage: 'rss upgrade',
            examples: [],
        };

        this.options.argsMin = 0;
        this.options.cooldown = 10000;
        this.options.hidden = true;

        this.permissions.staff.needed = this.axon.staff.owners;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg }) {
        const res = await this.rssHandler.updateFeedsConf();

        if (res) {
            return this.sendSuccess(msg.channel, `Vous avez bien mis a jour le module RSS.`);
        }
        return this.sendError(msg.channel, `Erreur lors de la mise a jour du module RSS (apis.json corrompu?).`);
    }
}

export default Upgrade;
