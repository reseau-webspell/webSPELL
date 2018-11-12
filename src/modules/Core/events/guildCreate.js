'use strict';

import { Event } from '../../../../..';

class GuildCreate extends Event {
    constructor(...args) {
        super(...args);

        /** Event Name (Discord name) */
        this.eventName = 'guildCreate';
        /** Event name (Function name) */
        this.label = 'guildCreate';

        this.enabled = true;

        this.infos = {
            owners: ['KhaaZ'],
            description: 'Guild Create event',
        };
    }

    execute(guild, guildConf) { // eslint-disable-line 
        this.Logger.info(`Guild created: ${guild.name} [${guild.id}]`);
        const wh = this.axon.webhooks.guild;
        const owner = guild.members.find(member => member.user.id === guild.ownerID).user;
        return this.bot.executeWebhook(wh.id, wh.token, {
            username: guild.name,
            avatarURL: guild.iconURL,
            embeds: [
                {
                    color: 3066993, // green
                    title: '<:success:470977663553503242> Guild created',
                    footer: {
                        text: `${this.bot.user.username} | Created at`,
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

export default GuildCreate;
