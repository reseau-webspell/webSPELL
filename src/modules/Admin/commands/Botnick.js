'use strict';

import { Command } from 'axoncore';

class Botnick extends Command {

    constructor(module) {
        super(module);

        this.label = 'botnick';
        this.aliases = ['botnick', 'botname'];

        this.infos = {
            owner: ['Ape', 'Eleos'],
            cmdName: 'botnick',
            description: 'Changes the nickname of the bot.',
            examples: ['botnick', 'botnick Best Bot'],
            arguments: [['nickname', true]]
        };

        this.permissions.bot = ['changeNickname'];
        this.permissions.user.needed = ['manageNicknames'];
        
        this.options.guildOnly = true;
    }

    async execute({ msg, args }) {
        let nickname = args.join(' ');

        if(nickname == '') {
            nickname = this.bot.user.username;
        }

        if(nickname.length > 32) {
            return this.sendError(msg.channel, 'The nickname can\'t be longer than 32 characters!');
        }

        try {
            await this.bot.editNickname(msg.channel.guild.id, nickname);

            return this.sendSuccess(msg.channel, `My nickname is now **${nickname}**.`);
        }
        catch (err) {
            return this.error(msg, err, 'API');
        }
    }
}

export default Botnick;
