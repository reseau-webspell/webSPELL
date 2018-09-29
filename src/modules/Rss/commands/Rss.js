'use strict';

import { Command } from 'axoncore';

import Enable from './Rss_Enable';
import Disable from './Rss_Disable';
import List from './Rss_List';
import Push from './Rss_Push';
import Role from './Rss_Role';
import Add from './Rss_Add';
import Create from './Rss_Create';
import Update from './Rss_Update';
import Remove from './Rss_Remove';
import Upgrade from './Rss_Upgrade';
import Test from './Rss_Test';

class Rss extends Command {
    constructor(module) {
        super(module);

        this.label = 'rss';
        this.aliases = ['rss'];

        this.hasSubcmd = true;
        this.subcmds = [Enable, Disable, List, Push, Role, Add, Create, Update, Remove, Upgrade, Test];

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss',
            description: 'Manage rss feeds.',
            usage: 'rss',
            examples: [],
        };

        this.options.argsMin = 0;
        this.options.cooldown = 3000;

        this.permissions.user.needed = ['manageGuild'];
        this.permissions.serverAdmin = true;
    }

    async execute({ msg }) {
        return this.sendHelp({ msg });
    }
}

export default Rss;
