'use strict';

import WebSpell from './WebSpell';

import axonConf from './configs/customConf.json';
import tokenConf from './configs/tokenConf.json';
import templateConf from './configs/templateConf.json';

const AxonOptions = {
    axonConf,
    templateConf,
    tokenConf,

    resolver: null,
    utils: null, // use your own Utils
    logger: null,
    db: null,
    axonSchema: null,
    guildSchema: null,
};

const Bot = new WebSpell(
    tokenConf.bot.token,
    {
        autoreconnect: true,
        defaultImageFormat: 'png',
        defaultImageSize: 512,
        disableEveryone: true,
        getAllUsers: true,
        messageLimit: 100,
        restMode: true,
    },
    AxonOptions
);

export default Bot;
