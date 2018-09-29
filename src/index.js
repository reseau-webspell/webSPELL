import Bot from './Bot';

// packages
import mongoose from 'mongoose';

import { webhooks } from './configs/tokenConf.json';

const guildWH = { id: webhooks.guild.id, token: webhooks.guild.token };

try {
    mongoose.connect('mongodb://localhost/webSpellDB');
    Bot.Logger.notice('Connected to webSpell DataBase.');
    Bot.AxonUtils.triggerWebhook('loader', {
        color: 0x008000,
        description: 'Connected to WebSPELL DataBase!',
    }, 'DATABASE');
} catch (e) {
    Bot.Logger.emerg('Could NOT connect to WebSpell DataBase.\n' + e.stack);
    Bot.AxonUtils.triggerWebhook('loader', {
        color: 0xFF0000,
        description: `Could not connect to WebSpell DataBase!\n${e.message}`,
    }, 'DATABASE');
}

Bot.start();
Bot.Logger.notice('=== ONLINE ===');
Bot.AxonUtils.triggerWebhook('status', {
    color: 0x008000,
    description: 'ONLINE!',
});

Bot.client.on('guildCreate', (guild) => {
    const owner = guild.members.find(member => member.user.id === guild.ownerID).user;
    Bot.client.executeWebhook(guildWH.id, guildWH.token, {
        username: guild.name,
        avatarURL: guild.iconURL,
        embeds: [
            {
                color: 3066993, // green
                title: '<:success:470977663553503242> Guild created',
                footer: {
                    text: `${Bot.client.user.username} | Created at`,
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
});

Bot.client.on('guildDelete', (guild) => {
    const owner = guild.members.find(member => member.user.id === guild.ownerID).user;
    Bot.client.executeWebhook(guildWH.id, guildWH.token, {
        username: guild.name,
        avatarURL: guild.iconURL,
        embeds: [
            {
                color: 15158332, // red
                title: '<:error:470977663356633099> Guild deleted',
                footer: {
                    text: `${Bot.client.user.username} | Deleted at`,
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
});
