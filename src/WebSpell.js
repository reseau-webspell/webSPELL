'use strict';

import { AxonClient, Resolver } from 'axoncore';

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
    constructor(client, axonOptions) {
        super(client, axonOptions, modules);

        this.Resolver = Resolver; // axonCore 1.0
    }

    initStaff() {
        this.staff.manager = [];
    }

    init() {
        return Promise.resolve(); // moved RSS start to RSS module
    }

    sendFullHelp(msg) {
        return this.AxonUtils.sendMessage(msg.channel, {
            embed: {
                author: {
                    name: this.client.user.username,
                    url: 'https://webspell.fr/bot/',
                    icon_url: this.client.user.avatarURL,
                },
                title: 'Message d\'aide',
                url: 'https://webspell.fr',
                description: 'WebSPELL - un bot multi fonction pour le réseau WebSPELL.\nSuivez l\'actualité des sites du réseau WebSPELL simplement!',
                fields: [
                    {
                        name: 'RSS',
                        value: '`//rss enable <site> <#channel>`\n`//rss disable <site>`\n`//rss list`\n`//rss role <site> <votre-role>`\n`//rss push <site>`',
                    },
                    {
                        name: 'Liste des sites 1/2',
                        value: '<:splashtoon:603561200835493935> `splashtoon.fr`\n<:nintendoz:603562424422891539> `nintendoz.fr`\n<:fortnitro:603562293434908682> `fortnitro.fr`\n<:logoac:603561645557547038> `animal-crossing.fr`\n<:xboxmag:603560918210576384> `xboxmag`\n<:playstation:603560918890053645> `playstation`\n<:paladins:603560919645290515> `paladins`\n<:fortnite:603560917883420682> `fortnite`\n<:steam:603560922736230404> `steam`\n<:ubisoft:603560920337088516> `ubisoft`\n<:overwatch:603560917485223987> `overwatch`\n<:nintendo:603560918772613130> `nintendo`\n<:vakarm:603560922643955732> `vakarm`\n<:gameblog:603560919347232768> `gameblog`\n<:pugilatdesetoiles:603560918927933450> `pugilatdesetoiles.com`\n<:ebtv:603560915417169921> `ebtv`\n<:Xboxygen:603560917283766272> `xboxygen`\n<:xboxlive:603560917812379678> `xboxlive`\n<:pokemontrash:603560918747709462> `pokemontrash.com`\n<:jvc:603560915769491456> `jvc`\n<:minecraftfr:603560917216657408> `minecraft.fr`\n<:diablo3:603560923441135627> `diablo3`',
                    },
					{
						name: 'Liste des sites 2/2',
                        value: '<:rockstarmag:603560921989644303> `rockstarmag`\n<:elderscrollsonline:603560922484834314> `elderscrollsonline.com`\n',
                    },
                    {
                        name: 'Gestion',
                        value: '`//prefix <prefix>` - changer de prefix\n`//botnick <nickname>` - changer le nickname du bot',
                    },
                    {
                        name: 'Serveur de Support',
                        value: 'https://discord.gg/ZHndGnn',
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Runs with AxonCore(https://github.com/Khaazz/AxonCore)',
                },
            },
        });
    }

    initStatus() {
        this.client.editStatus(null, {
            name: `webspell.fr | ${this.params.prefix[0]}help`,
            type: 3,
        });
    }
}

export default WebSpell;
