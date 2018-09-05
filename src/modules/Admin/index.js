'use strict';

import { Module } from 'axoncore';

import * as commands from './commands/index';
// import * as events from './event/index';

class Admin extends Module {
    constructor(...args) {
        super(...args);

        this.label = 'Admin';

        this.enabled = true;
        this.serverBypass = false;

        this.infos = {
            name: 'Admin',
            description: 'Commands for server admins.',
        };

        this.init(commands);
    }
}

export default Admin;
