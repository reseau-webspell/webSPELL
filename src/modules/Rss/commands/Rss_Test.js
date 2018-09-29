'use strict';

import { Command } from 'axoncore';
import { inspect } from 'util';

class Test extends Command {
    constructor(module) {
        super(module);

        this.label = 'test';
        this.aliases = ['test'];

        this.isSubcmd = true;

        this.infos = {
            owner: ['KhaaZ'],
            name: 'rss test',
            description: 'Test a rss feed.',
            usage: 'rss test [feed url]',
            examples: [],
        };

        this.options.argsMin = 1;
        this.options.cooldown = 60000;
        this.options.hidden = true;

        this.permissions.staff.needed = this.axon.staff.owners;

        this._tryNmb = 15;
        this._errMax = Math.round(this.tryNmb * 75 / 100);
        this.sleepTime = 3; // time in seconds
        this._running = false;
    }

    set tryNmb(value) {
        this._tryNmb = value;
        this._errMax = Math.round(this.tryNmb * 75 / 100);
    }

    get tryNmb() {
        return this._tryNmb;
    }

    get errMax() {
        return this._errMax;
    }

    get rssHandler() {
        return this.module.APIHandler;
    }

    async execute({ msg, args }) {
        if (this._running) {
            return this.sendSuccess(msg.channel, `There is already a test sequence running.`);
        }

        const url = args[0];
        let errCount = 0;
        let res;

        this.sendSuccess(msg.channel, `Sequence de test initialisée pour **${url}**.\n\`ETA: ${this.tryNmb * this.sleepTime}sec\`\n\`Essais: ${this.tryNmb}\``);

        this._running = true;

        this.Logger.notice(`Sequence de test initialisée pour ${url}.`);
        for (let i = 0; i < this.tryNmb; i++) {
            try {
                res = await this.rssHandler.parser.parseURL(url);
                this.Logger.verbose(`Test: ${i}`);
            } catch (err) {
                if (err.message === 'Status code 404') {
                    this._running = false;
                    this.Logger.notice(`Sequence de test terminée pour ${url} avec ${err.message}.`);
                    return this.sendError(msg.channel, `Feed invalide (\`NOT FOUND\`) - Le feed n'existe pas.`);
                } else if (err.message === 'Status code 400') {
                    this._running = false;
                    this.Logger.notice(`Sequence de test terminée pour ${url} avec ${err.message}.`);
                    return this.sendError(msg.channel, `Feed invalide (\`NOT FOUND\`) - Pas une url valide.`);
                }
                errCount += 1;
                this.Logger.verbose(`Error: ${errCount}\n${err.stack}`);
            }
            await this.Utils.sleep(this.sleepTime * 1000);
        }
        this.Logger.notice(`Sequence de test terminée pour ${url} avec ${errCount} erreurs.`);

        this._running = false;

        if (errCount < this.errMax) {
            if (res && res.items && res.items[0]) {
                if (res && res.items && res.items[0] && (res.items[0].guid || res.items[0].isoDate)) {
                    return this.sendSuccess(msg.channel, `Ce feed est considéré valide avec un taux d'erreur de \`${errCount}/${this.tryNmb}\`.`);
                } else {
                    this.Logger.verbose(`Feed structure:\n${inspect(res.items[0])}`);
                    return this.sendError(msg.channel, `Ce feed est considéré valide avec un taux d'erreur de \`${errCount}/${this.tryNmb}\`.\nCe feed ne possède ni \`guid\`, ni \`isoDate\``);
                }
            } else {
                this.Logger.verbose(`Feed structure:\n${inspect(res)}`);
                return this.sendError(msg.channel, `Ce feed est considéré valide avec un taux d'erreur de \`${errCount}/${this.tryNmb}\`.\nCe feed possède une structure inhabituelle`);
            }
        }
        return this.sendError(msg.channel, `Ce feed est considéré invalide avec un taux d'erreur de \`${errCount}/${this.tryNmb}\`.`);
    }
}

export default Test;
