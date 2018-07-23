'use strict';

import { Command } from 'axoncore';

class Disable extends Command {

    constructor(module) {
        super(module);

        this.label = 'disable';
        this.aliases = ['disable'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            cmdName: 'disable',
            description: 'Disable rss feed.',
            examples: ['disable'],
            arguments: []
        };

        this.options.argsMin = 1;
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
            return this.sendError(msg.channel, 'Vous devez choisir un webhook a supprimer (`splashtoon` ou `nintendoz`)');
        }

        const res = await API.removeGuildObj(msg.channel.guild.id);
        if (res === null) {
            return this.sendError(msg.channel, 'Ce feed RSS n\'existe pas.');
        }
        
        /** Deletion du webhook */
        try {
            await this.bot.deleteWebhook(res.webhookID, res.webhookToken, `WebSpell RSS feed (${type}.`);
        } catch(err) {
            return this.error('No manage webhooks permission in that channel!', err, 'API');
        }

        return this.sendSuccess(msg.channel, `Vous avez bien désactivé les RSS pour **${type}**.`);
    }
}

export default Disable;
