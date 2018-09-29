'use strict';

import { Command } from 'axoncore';

class List extends Command {
    constructor(module) {
        super(module);

        this.label = 'list';
        this.aliases = ['list'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss list',
            description: 'List all rss feed in the guild.',
            usage: 'rss list',
            examples: [],
        };

        this.options.argsMin = 0;
        this.options.cooldown = 10000;

        this.permissions.user.needed = ['manageGuild'];
        this.permissions.serverAdmin = true;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg }) {
        const guild = msg.channel.guild;

        const list = [];
        const channels = {};
        for (const api of this.rssHandler.apis.toArray()) {
            const gObj = api.guilds[guild.id];
            if (gObj) {
                let chan = channels[gObj.chan];
                if (!chan) {
                    const tmp = this.Resolver.channel(guild, gObj.chan);
                    if (!tmp) {
                        break;
                    }
                    channels[tmp.id] = tmp.name;
                    chan = tmp.name;
                }

                let text = `**${api.name ? api.name : api.url}** - **${chan}**(${gObj.chan})`;
                if (gObj.role) {
                    text += `\n - **role**: ${(gObj.role === 'everyone' || gObj.role === 'here') ? `@${gObj.role}` : `<@&${gObj.role}>`}`;
                }
                list.push(text);
            }
        }
        return this.sendMessage(msg.channel, {
            embed: {
                author: {
                    name: 'List des feeds activés',
                },
                description: list.length > 0 ? list.join('\n') : 'Aucun feeds activés.',
            },
        });
    }
}

export default List;
