'use strict';

import { Command } from 'axoncore';

import Enable from './Rss_Enable';
import Disable from './Rss_Disable';

class Rss extends Command {

    constructor(module) {
        super(module);

        this.label = 'rss';
        this.aliases = ['rss'];

        this.hasSubcmd = true;
        this.subcmds = [Enable, Disable];

        this.infos = {
            owner: ['KhaaZ'],
            cmdName: 'rss',
            description: 'rss feed.',
            examples: ['rss'],
            arguments: []
        };

        this.options.argsMin = 0;
        this.options.cooldown = 3000;
        this.options.guildOnly = false;

        //this.permissions.serverAdmin = true;
        this.permissions.user.needed = ['manageGuild'];
    }

    async execute({ msg }) {
        return this.sendHelp({msg});
    }
}

export default Rss;
