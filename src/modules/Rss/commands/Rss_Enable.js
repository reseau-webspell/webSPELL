'use strict';

import { Command } from 'axoncore';

class Enable extends Command {

    constructor(module) {
        super(module);

        this.label = 'enable';
        this.aliases = ['enable'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            cmdName: 'enable',
            description: 'Enable rss feed.',
            examples: ['enable'],
            arguments: []
        };

        this.options.argsMin = 2;
        this.options.cooldown = 10000;
        this.options.guildOnly = false;

        this.permissions.bot = ['manageWebhooks'];
        //this.permissions.serverAdmin = true;
        this.permissions.user.needed = ['manageGuild'];
    }

    async execute({ msg, args }) {
        const type = args[0].toLowerCase();

        let API;
        API = (type === 'splashtoon') ? this.module._splashtoonAPI : null ;
        !API && (API = (type === 'nintendoz') ? this.module._nintendozAPI : null);
        
        if (!API) {
            return this.sendError(msg.channel, 'Vous devez choisir un webhook a activer (`splashtoon` ou `nintendoz`)');
        }

        const channel = this.Resolver.channel(msg.channel.guild, args[1]);
        if (!channel) {
            return this.sendError(msg.channel, 'Vous devez entrer un salon valide');
        }

        /** Creation du webhook */
        let webhook;
        try {
            webhook = await this.bot.createChannelWebhook(channel.id, {
                name: this.bot.user.username + ` (${type})`
            }, `WebSpell RSS feed (${type}.`);
        } catch(err) {
            return this.error(msg, err, 'API', 'No manage webhooks permission in that channel!');
        }

        const guildObj = {
            gID: msg.channel.guild.id,
            webhookID: webhook.id,
            webhookToken: webhook.token,
            enabled: true
        };

        const res = await API.addGuildObj(guildObj);
        // res not null = there were already a webhook registered for this guild. disable that webhooks. 
        if (res) {
            /** Deletion du webhook */
            try {
                await this.bot.deleteWebhook(res.webhookID, res.webhookToken, `WebSpell RSS feed (${type}.`);
            } catch(err) {
                return this.error(msg, err, 'API', 'No manage webhooks permission in that channel!');
            }
        }
        
        return this.sendSuccess(msg.channel, `Vous avez bien activé les RSS pour **${type}** dans **${channel.name}**.`);
    }
}

export default Enable;
