import Bot from './Bot';

// packages
import mongoose from 'mongoose';

const generalWH = { id: '470976289126219776', token: 'IlbJSdh2OUDEVheYpeL9JtG1YTmzz0IXkwFfalP0qBJJO9Usyl3-6Sm2LA-6xPsAVChN' };
const loaderWH = { id: '470976387059023872', token: 'Pz2N1I6D49b-9tXE2mh-V0vQpmJKfg5hkVMdhhpk_8G_ZYa5pPChe2k-wxc-lIcKCPl9' };
const errorWH = { id: '470976423071580177', token: 'C5l8as6hxCd9tHvjxOOELNF5_mkXPm3-VoQbAVT0ViIce8-WofdJkoYdmgysvIpBXV8t' };
const guildWH = { id: '470978963020316682', token: 'uUZY42dI_H8DUcjg7amEEYOclhIdGrKYYNLnupjrvUtUmWzFSZmfGoxTsMFNgmgpca9o' };
try {
    mongoose.connect('mongodb://localhost/webSpellDB');
    Bot.Logger.notice('Connected to webSpell DataBase.');
    Bot.executeWebhook(loaderWH.id, loaderWH.token, {
        'username': 'DataBase Loader',
        'avatarURL': Bot.user.avatarURL,
        'content': 'Connected to WebSPELL DataBase!',
    });
} catch (e) {
    Bot.executeWebhook(loaderWH.id, loaderWH.token, {
        'username': 'DataBase Loader',
        'avatarURL': Bot.user.avatarURL,
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
        'avatarURL': Bot.user.avatarURL,
        'content': `Uncaught Exception!\n${err.message}`,
    });

    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    Bot.Logger.error(err.stack);

    Bot.emit('error', err);
    
    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Error',
        'avatarURL': Bot.user.avatarURL,
        'content': `Unhandled Rejection!\n${err.message}`,
    });
});

Bot.on('error', (err) => {
    Bot.Logger.error(err.stack);

    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Error',
        'avatarURL': Bot.user.avatarURL,
        'content': `Error!\n${err.message}`,
    });
});

Bot.on('warn', (msg) => {
    Bot.Logger.warn(msg);
    Bot.executeWebhook(errorWH.id, errorWH.token, {
        'username': 'Warn',
        'avatarURL': Bot.user.avatarURL,
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
        'avatarURL': Bot.user.avatarURL,
        'content': 'ONLINE!',
    });
});
