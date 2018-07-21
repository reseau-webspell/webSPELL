'use strict';

import superagent from 'superagent';
import execa from 'execa';

import { Command } from 'axoncore';

class Exec extends Command {

    constructor(module) {
        super(module);

        this.label = 'exec';
        this.aliases = ['exec'];

        this.infos = {
            owner: ['AS04'],
            cmdName: 'exec',
            description: 'Execute terminal commands directly from Discord. (cannot accept user input)',
            examples: ['exec pm2 list'],
            arguments: [['command', false]]
        };

        this.options.argsMin = 1;

        this.permissions.staff.needed = this.bot.staff.owners;
    }

    /**
    * A function to execute a command.
    * Uses the execa npm module.
    * @arg {String} command - The command to execute
    * @arg {Array} [args=[]] - The arguments for that command. Optional, defaults to an empty array.
    */
    async exec(command, args = []) {
        let result;
        try {
            const res = await execa(command, args, {
                timeout: (120 * 1000)
            });
            result = {
                success: true,
                output: res.stdout,
                error: res.stderr ? res.stderr : undefined,
                command: res.cmd,
                failed: res.failed,
                original: res
            };
        } catch (e) {
            result = {
                success: false,
                toString: e.toString(),
                failed: e.failed,
                command: e.cmd,
                original: e
            };
        }
        return result;
    }

    /**
     * A function to send data to Github to create an anonymous gist.
     * @param {String} data - The data to send.
     * @param {String} title - The title to give to the file.
     * @param {String} [extension] - The extension to give to the file. Optional, defaults to txt.
     */
    async sendToGist(data, title, extension = 'txt') {
        let gist = {};
        gist.files = {};
        gist.files[`${title}.${extension}`] = {
            content: data
        };

        gist = await superagent
            .post('https://api.github.com/gists')
            .send(gist)
            .type('application/json')
            .timeout({
                response: 5000,
                deadline: 15000
            });
        gist = gist.body;

        return gist.html_url;
    }

    async execute({ msg, args }) {
        const command = args.shift();

        const result = await this.exec(command, args);
        if (result.success) {
            const code = `${result.output ? `Output:\n${result.output}` : ''}${result.error ? `\nError:\n${result.error}` : ''}`;
            if (code.length > 2000) {
                const gist = await this.sendToGist(code, result.command);
                return this.sendError(msg.channel, `Output: <${gist}>`);
            }

            return this.sendSuccess(msg.channel, `Command: ${result.command}\n\`\`\`js\n${code}\n\`\`\``);
        } else {
            const code = `${result.toString}`;
            if (code.length > 2000) {
                const gist = await this.sendToGist(code, result.command);
                return this.sendError(`Output: <${gist}>`);
            }

            return this.sendError(msg.channel, `Command: ${result.command}\n\`\`\`js\n${code}\n\`\`\``);
        }
    }
}

export default Exec;
