'use strict';

import { Module } from 'axoncore';

import APIHandler from './api/APIHandler';

import * as commands from './commands/index';
// import * as events from './events/index';
import RssSchema from './models/RssSchema';

class Rss extends Module {
    constructor(...args) {
        super(...args);

        this.label = 'Rss';

        this.enabled = true;
        this.serverBypass = false;

        this.infos = {
            name: 'Rss Feed',
            description: 'API and commands to receive rss feed.',
        };

        this.APIHandler = new APIHandler(this);

        this.bot.once('ready', () => this.APIHandler.init());

        this.init(commands, undefined, { RssSchema });
    }
}

export default Rss;
