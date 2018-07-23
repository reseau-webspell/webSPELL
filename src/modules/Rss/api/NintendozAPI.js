'use strict';

import rssParser from 'rss-parser';
import RssSchema from '../models/RssSchema';

class NintendozAPI {
    constructor(module) {
        this.bot = module._client;
        this.parser = new rssParser();

        this._url = 'https://nintendoz.fr/feed/';

        this.lastArticle = null;
        this.guilds = [];
        
        this.init();
    }

    /**
     * Init cache and first query if needed
     *
     * @memberof NintendozAPI
     */
    async init() {
        await this.getGuilds();
        const [data, guid] = await this.queryFeed();
        if (data != null) {
            this.executeWH(data);
            this.updateLastArticle(guid);
        }
        this.timer();
    }

    timer() {
        setInterval(() => {
            this.bot.Logger.verbose('RSS FEED - API requesting Nintendoz.');
            this.run();
        }, 600000);
    }

    /**
     * Query feed and if the result is not null (= new article was posted)
     * Execute all webhooks
     * Update last article in cache
     *
     * @memberof NintendozAPI
     */
    async run() {
        const [data, guid] = await this.queryFeed();
        if (data != null) {
            this.executeWH(data);
            this.updateLastArticle(guid);
        }
    }

    /**
     * Query RSS feed url
     * extract data and guid
     * returns null if the news was already posted.
     * Otherwise returns the data parsed as correct options object and the guid
     *
     * @returns {Array<[Object, String]>} [Options Obj, guid]
     * @memberof NintendozAPI
     */
    async queryFeed() {
        const resJson = await this.parser.parseURL(this._url);
        const last = resJson.items[0];
        
        const guid = this.parseGUID(last.guid);
        
        if (guid === this.lastArticle) {
            return [null, null];
        }
        return [this.createContent(last), guid];
    }

    /**
     * Execute All webhoks if enabled
     * If present in the array = enabled (theory)
     *
     * @param {Object} options - options object to create the webhook
     * @memberof NintendozAPI
     */
    executeWH(options) {
        for (const obj of this.guilds) {
            if (obj.enabled) {
                this.bot.executeWebhook(obj.webhookID, obj.webhookToken, options);
            }
        }
    }

    /**
     * Retrieve DB
     * Update cached guilds
     * Update cached last article guid
     *
     * @returns {Promise<Array>} Array of guilds object
     * @memberof NintendozAPI
     */
    async getGuilds() {
        let rssSchema;
        try {
            rssSchema = await RssSchema.findOne({ 'ID': 1 });
            if (!rssSchema) { // No Schema in DB
                rssSchema = await RssSchema.findOneAndUpdate({
                    ID : '1',
                },
                {
                    ID: '1'
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                });
            }
        } catch (err) {
            err.message = 'Critical - Couldn\'t retrieve RssSchema';
            throw err;
        }

        this.lastArticle = rssSchema.NintendozLast;
        this.guilds = rssSchema.NintendozWH; // cache webhooks
        return rssSchema.NintendozWH;
    }

    /**
     * Query DB
     * Update guid last article
     * Update cache guid
     *
     * @param {String} guid
     * @memberof NintendozAPI
     */
    async updateLastArticle(guid) {
        try {
            this.lastArticle = guid;
            await RssSchema.findOneAndUpdate({
                ID : '1',
            },
            {
                $set: {
                    NintendozLast: guid
                }
            },
            {
                new: true,
                upsert: true,
            });
        } catch (err) {
            err.message += 'Critical - Couldn\'t retrieve RssSchema';
            throw err;
        }
    }

    /**
     * Parse json data to extract content
     * Create an option object for webhooks
     *
     * @param {Object} data - json data from RSS
     * @returns {Object} Options object to send via webhook
     * @memberof NintendozAPI
     */
    createContent(data) {
        const options = {};
        options.content = `**${data.title}**. Lien de l'article: ${data.link}`;

        options.avatarURL = this.bot.user.avatarURL;
        options.username = this.bot.user.username;
        return options;
    }

    /**
     * Parse specific guid out of global string
     *
     * @param {String} string - string to parse (from rss)
     * @returns
     * @memberof NintendozAPI
     */
    parseGUID(string) {
        const guid = /\d*$/.exec(string);
        return guid ? guid[0] : null;
    }

    /**
     * Update cache and call update DB
     * Add
     * 
     * @param {Object} guildObj
     * @returns  {Promise<Object|null>} Old Guild Object or null
     * @memberof NintendozAPI
     */
    addGuildObj(guildObj) {
        const oldGuildObj = this.guilds.find(g => g.gID === guildObj.gID);
        // already an old obj => delete
        oldGuildObj && (this.guilds = this.guilds.filter(go => go.gID != guildObj.gID));

        // push new object (udpdate cache)
        this.guilds.push(guildObj);
        // update DB
        this.updateGuidObj(this.guilds);
        oldGuildObj ? Promise.resolve(oldGuildObj) : Promise.resolve(null);
    }

    /**
     * Update cache and call update DB
     * remove
     * 
     * @param {String} gID - guildID
     * @returns  {Promise<Object|null>} Old Guild Object or null
     * @memberof NintendozAPI
     */
    removeGuildObj(gID) {
        const oldGuildObj = this.guilds.find(g => g.gID === gID);
        if (oldGuildObj) {
            // remove old
            this.guilds = this.guilds.filter(go => go.gID != gID);
            // update DB
            this.updateGuidObj(this.guilds);
            return Promise.resolve(oldGuildObj);
        }
        // doesn't already exist, return null
        return Promise.resolve(null);
    }

    /**
     * Update DB using cached current guildsObj.
     *
     * @param {Array<Object>} guildsArr
     * @returns {Promise<Array<Object>>} Array
     * @memberof NintendozAPI
     */
    async updateGuidObj(guildsArr) {
        try {
            await RssSchema.findOneAndUpdate({
                ID : '1',
            },
            {
                $set: {
                    NintendozWH: guildsArr
                }
            },
            {
                new: true,
                upsert: true,
            });
        } catch (err) {
            err.message = 'Critical - Couldn\'t update RssSchema';
            throw err;
        }
    }
}

export default NintendozAPI;
