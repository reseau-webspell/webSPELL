'use strict';

import { Command } from 'axoncore';

class Role extends Command {
    constructor(module) {
        super(module);

        this.label = 'role';
        this.aliases = ['role'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss role',
            description: 'Edit role to mention.',
            usage: 'rss role [feed name | feed url] [role]',
            examples: ['rss role splashtoon everyone', 'rss role splashtoon splashtoonRole'],
        };

        this.options.argsMin = 2;
        this.options.cooldown = 10000;

        this.permissions.user.needed = ['manageGuild'];
        this.permissions.serverAdmin = true;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        const api = this.rssHandler.apis.find(a => a.name.toLowerCase() === args[0].toLowerCase());
        if (!api) {
            return this.sendError(msg.channel, 'Ce feed n\'existe pas!');
        }
        if (!api.guilds[msg.channel.guild.id]) {
            return this.sendError(msg.channel, 'Vous n\'avez pas souscris a ce feed!');
        }

        let role;
        if (args[1] === 'everyone' || args[1] === 'here') {
            role = args[1];
        }
        let roleObj;
        if (!role) {
            roleObj = this.Resolver.role(msg.channel.guild, args.slice(1));
            if (!roleObj) {
                return this.sendError(msg.channel, 'Ce role n\'existe pas!');
            } else {
                role = roleObj.id;
            }
        }

        await this.rssHandler.updateRoleFeed(api.url, msg.channel.guild.id, role);
        return this.sendSuccess(msg.channel, `Vous avez changé le role a mentionné pour **${api.name}** pour etre **${roleObj ? roleObj.name : role}**.`);
    }
}

export default Role;
