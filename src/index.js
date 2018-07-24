import Bot from './Bot';

// packages
import mongoose from 'mongoose';

import tokens from './configs/tokenConf.json';
const wh = tokens.webHook;
const generalWH = { id: wh.general.id, token: wh.general.token };
const loaderWH = { id: wh.loader.id, token: wh.loader.token };
const errorWH = { id: wh.error.id, token: wh.error.token };
const guildWH = { id: wh.guildLog.id, token: wh.guildLog.token };

try {
    mongoose.connect('mongodb://localhost/webSpellDB');
    Bot.Logger.notice('Connected to webSpell DataBase.');
    Bot.executeWebhook(loaderWH.id, loaderWH.token, {
        'username': 'DataBase Loader',
        'content': 'Connected to WebSPELL DataBase!',
    });
} catch (e) {
    Bot.executeWebhook(loaderWH.id, loaderWH.token, {
        'username': 'DataBase Loader',
        'content': ` Could not connect to WebSpell DataBase!\n${e.message}`,
    });
    Bot.Logger.emerg('Could NOT connect to WebSpell DataBase.\n' + e.stack);
}

// User ned to Deal with error listener by himself
// where to log etc
// Error Listeners
process.on('uncaughtException', (err) => {
    Bot.Logger.emerg(err.stack);
    Bot.emit('error', err);

    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Error',
        'content': `Uncaught Exception!\n${err.message}`,
    });

    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    Bot.Logger.error(err.stack);

    Bot.emit('error', err);
    
    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Error',
        'content': `Unhandled Rejection!\n${err.message}`,
    });
});

Bot.on('error', (err) => {
    Bot.Logger.error(err.stack);

    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Error',
        'content': `Error!\n${err.message}`,
    });
});

Bot.on('warn', (msg) => {
    Bot.Logger.warn(msg);
    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Warn',
        'content': `Warn!\n${msg}`,
    });
});

Bot.on('guildCreate', (guild) => {
    const owner = guild.members.find(member => member.user.id === guild.ownerID).user;
    Bot.executeWebhook(guildWH.id, guildWH.token, {
        'username': guild.name,
        'avatarURL': guild.iconURL,
        'embeds': [
            {
                color: 3066993, // green
                title: '<:success:470977663553503242> Guild created',
                footer: {
                    text: `${Bot.user.username} | Created at`
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: 'Name:',
                        value: `${guild.name}`,
                        inline: true
                    },
                    {
                        name: 'ID:',
                        value: `${guild.id}`,
                        inline: true
                    },
                    {
                        name: 'Region:',
                        value: `${guild.region}`,
                        inline: true
                    },
                    {
                        name: 'Owner:',
                        value: `${owner.username + '#' + owner.discriminator}`,
                        inline: true
                    },
                    {
                        name: 'Owner ID:',
                        value: `${guild.ownerID}`,
                        inline: true
                    },
                    {
                        name: 'Members:',
                        value: `${guild.memberCount}`,
                        inline: true
                    }
                ]
            },
        ]
    });
});

Bot.on('guildDelete', (guild) => {
    const owner = guild.members.find(member => member.user.id === guild.ownerID).user;
    Bot.executeWebhook(guildWH.id, guildWH.token, {
        'username': guild.name,
        'avatarURL': guild.iconURL,
        'embeds': [
            {
                color: 15158332, // red
                title: '<:error:470977663356633099> Guild deleted',
                footer: {
                    text: `${Bot.user.username} | Deleted at`
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: 'Name:',
                        value: `${guild.name}`,
                        inline: true
                    },
                    {
                        name: 'ID:',
                        value: `${guild.id}`,
                        inline: true
                    },
                    {
                        name: 'Region:',
                        value: `${guild.region}`,
                        inline: true
                    },
                    {
                        name: 'Owner:',
                        value: `${owner.username + '#' + owner.discriminator}`,
                        inline: true
                    },
                    {
                        name: 'Owner ID:',
                        value: `${guild.ownerID}`,
                        inline: true
                    },
                    {
                        name: 'Members:',
                        value: `${guild.memberCount}`,
                        inline: true
                    }
                ]
            },
        ]
    });
});

// Connection
Bot.connect().then(() => {
    Bot.Logger.notice('=== ONLINE ===');
    Bot.executeWebhook(generalWH.id, generalWH.token, {
        'username': 'Uptime',
        'content': 'ONLINE!',
    });
});
