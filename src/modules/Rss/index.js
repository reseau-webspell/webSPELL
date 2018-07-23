'use strict';

import { Module } from 'axoncore';

import SplashtoonAPI from './api/SplashtoonAPI';
import NintendozAPI from './api/NintendozAPI';

import * as commands from './commands/index';
//import * as events from './commands/index';

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

        this._splashtoonAPI = new SplashtoonAPI(this);
        this._nintendozAPI = new NintendozAPI(this);

        this.init(commands);
    }
}

export default Rss;
