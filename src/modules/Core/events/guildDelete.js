'use strict';

import { Event } from 'axoncore';

class GuildDelete extends Event {
    constructor(...args) {
        super(...args);

        /** Event Name (Discord name) */
        this.eventName = 'guildDelete';
        /** Event name (Function name) */
        this.label = 'guildDelete';

        this.enabled = true;

        this.infos = {
            owners: ['KhaaZ'],
            description: 'Guild Delete event',
        };
    }

    execute(guild, guildConf) { // eslint-disable-line 
        console.log(`Guild deleted: ${guild.name} [${guild.id}]`);
        const wh = this.axon.webhooks.guild;
        const owner = guild.members.find(member => member.user.id === guild.ownerID).user;
        return this.bot.executeWebhook(wh.id, wh.token, {
            username: guild.name,
            avatarURL: guild.iconURL,
            embeds: [
                {
                    color: 15158332, // red
                    title: '<:error:603603044516757554> Guild deleted',
                    footer: {
                        text: `${this.bot.user.username} | Deleted at`,
                    },
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'Name:',
                            value: `${guild.name}`,
                            inline: true,
                        },
                        {
                            name: 'ID:',
                            value: `${guild.id}`,
                            inline: true,
                        },
                        {
                            name: 'Region:',
                            value: `${guild.region}`,
                            inline: true,
                        },
                        {
                            name: 'Owner:',
                            value: `${owner.username + '#' + owner.discriminator}`,
                            inline: true,
                        },
                        {
                            name: 'Owner ID:',
                            value: `${guild.ownerID}`,
                            inline: true,
                        },
                        {
                            name: 'Members:',
                            value: `${guild.memberCount}`,
                            inline: true,
                        },
                    ],
                },
            ],
        });
    }
}

export default GuildDelete;
