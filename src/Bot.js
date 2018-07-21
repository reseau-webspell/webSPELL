'use strict';

import WebSpell from './WebSpell';

import config from './configs/customConf.json';
import tokenConf from './configs/tokenConf.json';

const Bot = new WebSpell(
    tokenConf.bot.token,
    {
        autoreconnect: true,
        defaultImageFormat: 'png',
        defaultImageSize: 512,
        disableEveryone: true,
        getAllUsers: true,
        messageLimit: 100,
        restMode: true
    },
    config
);

export default Bot;
