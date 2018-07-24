'use strict';

import AxonClient from 'axoncore';

import * as modules from './modules/index';

/**
 * Example - Client constructor
 *
 * @author KhaaZ
 * 
 * @class Client
 * @extends {AxonCore.AxonClient}
 */
class WebSpell extends AxonClient {
    constructor(token, options, config) {
        super(token, options, config, modules);

    }

    initStaff() {
        this.staff.manager = [];
    }

    /** CURRENTLY DISABLED */
    $init() {
        return new Promise((resolve, reject) => {
            try {
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    sendFullHelp(msg) {
        return this.bot.createMessage(msg.channel.id, {
            embed: {
                author: {
                    name: this.user.username,
                    url: 'https://webspell.fr',
                    icon_url: this.user.avatarURL
                },
                title: 'Message d\'aide',
                url: 'https://webspell.fr',
                description: 'WebSPELL - un bot multi fonction pour le réseau WebSPELL.\nSuivez l\'actualité des sites du réseau WebSPELL simplement!',
                fields: [
                    {
                        name: 'RSS',
                        value: '`//rss enable <splashtoon|nintendoz> <#channel>`\n`//rss disable <splashtoon|nintendoz>`'
                    },
                    {
                        name: 'Gestion',
                        value: '`//prefix <prefix>` - changer de prefix\n`//botnick <nickname>` - changer le nickname du bot'
                    },
                    {
                        name: 'Support server',
                        value: 'https://discord.gg/49sApBV'
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Run with AxonCore(https://github.com/Khaazz/AxonCore)'
                }
            }
        });
    }

    /** CURRENTLY DISABLED */
    initStatus() {
        this.editStatus(null, {
            name: `webspell.fr | ${this.params.prefix[0]}help`,
            type: 3
        });
    }

}

export default WebSpell;
