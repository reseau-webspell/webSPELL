'use strict';

import { Command } from 'axoncore';

class Pong extends Command {
    constructor(module) {
        super(module);

        this.label = 'pong';
        this.aliases = ['pong'];

        this.isSubcmd = true;
        this.hasSubcmd = false;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'ping pong',
            description: 'Pong the bot.',
            usage: 'ping pong',
            examples: ['ping pong'],
        };

        this.options.argsMin = 0;
        this.options.cooldown = 3000;
        this.options.guildOnly = false;
    }

    async execute({ msg }) {
        const start = Date.now();

        const mess = await this.sendMessage(msg.channel, 'BADABOUM!');
        if (!mess) {
            return;
        }

        const diff = (Date.now() - start);

        return this.editMessage(mess, `BADABOUM! \`${diff}ms\``);
    }
}

export default Pong;
