'use strict';

/**
 * Base API class.
 * A new instance of this class is created when creating an API
 *
 * @class RssAPI
 */
class RssAPI {
    /**
     * Creates an instance of RssAPI.
     * @param {Object} handler - APIHandler object
     * @param {Object} feed - feed object { url: '', name: null, image: null, guilds: {}}
     * @memberof RssAPI
     */
    constructor(handler, feed) {
        this._handler = handler;

        /** Feed definition */
        this.name = feed.name || null;
        this.image = feed.image || null;

        this._url = feed.url;
        this.last = feed.last || null;

        /**
         * {
         *      gID: { chan: chanID, role: role },
         *      gID: { chan: chanID, role: role }
         * }
         */
        this.guilds = feed.guilds || {};
    }

    get handler() {
        return this._handler;
    }

    get parser() {
        return this.handler.parser;
    }

    get module() {
        return this._handler._module;
    }

    get bot() {
        return this.module.bot;
    }

    get axon() {
        return this.module.axon;
    }

    get url() {
        return this._url;
    }

    toMongoFormat() {
        return {
            url: this.url,
            last: this.last,
            name: this.name,
            image: this.image,
            guilds: this.guilds,
        };
    }

    /**
     * Run the API
     * query the rss => if new article push to all webhook + update last article
     *
     * @returns {Promise<Boolean>} true if pushed news
     * @memberof RssAPI
     */
    async run() {
        const [data, guid] = await this.queryFeed();

        if (guid !== null) {
            this.axon.Logger.verbose(`Pushing: ${this.url}`);
            this.pushAll(data);

            /** new last => update */
            this.last = guid;

            return true;
        }
        return false;
    }

    /**
     * Query RSS feed url
     * extract data and guid
     * returns null if the news was already posted.
     * Otherwise returns the data parsed as correct options object and the guid
     *
     * @returns {Promise<Array<[Object, String]>>} [Options Obj, guid]
     * @memberof RssAPI
     */
    async queryFeed() {
        const resJson = await this.parser.parseURL(this._url);
        const last = resJson.items[0];

        if (last.guid === this.last || last.isoDate === this.last) {
            return [last, null];
        }
        return [this.createContent(last), last.guid ? last.guid : last.isoDate];
    }

    /**
     * Parse json data to extract content
     * Create an option object for webhooks
     *
     * @param {Object} data - json data from RSS
     * @returns {Object} Options object to send via webhook
     * @memberof RssAPI
     */
    createContent(data) {
        const options = {};
        options.content = `**${data.title}**. Lien de l'article: ${data.link}`;

        /** Use default value if image/name are null */
        options.avatarURL = this.image || this.bot.user.avatarURL;
        options.username = this.name || this.bot.user.username;
        return options;
    }

    /**
     * Execute All webhoks if enabled
     * If present in the array = enabled (theory)
     *
     * @param {Object} options - options object to create the webhook
     * @memberof RssAPI
     */
    pushAll(data) {
        for (const [gID, opt] of Object.entries(this.guilds)) {
            const [wh, options] = this.formatData(gID, opt, data);
            if (!wh) {
                break;
            }

            this.executeWH(gID, opt, wh, options);
        }
    }

    /**
     * Push last Article for the selected guild
     * Independent from all other logic (doesn't update last etc)
     * Remove WH object from Handler(cache) if it doesn't exist anymore
     *
     * @param {String} gID
     * @returns {Promise<Boolean>} true if worked
     * @memberof RssAPI
     */
    async pushLast(gID) {
        let [data] = await this.queryFeed();
        data = this.createContent(data);
        const opt = this.guilds[gID];

        const [wh, options] = this.formatData(gID, opt, data);
        if (!wh) {
            return false;
        }

        const res = await this.executeWH(gID, opt, wh, options);
        return res;
    }

    /**
     * Get the webhook to send the options using the option for this guild (channelID)
     * Format data using the options for this guild
     *
     * @param {String} gID
     * @param {Object} opt - { chan: '', role: '' }
     * @param {Object} options - data to send
     * @returns {Array[wh, options]} Webhook object + options to send
     * @memberof RssAPI
     */
    formatData(gID, opt, data) {
        const guild = this.handler.guilds.get(gID);
        if (!guild) {
            delete this.guilds[gID];
            return [null, data];
        }

        const wh = guild[opt.chan];
        if (!wh) {
            delete this.guilds[gID][opt.chan];
            return [null, data];
        }

        const options = Object.assign({}, data);
        if (opt.role) {
            if (opt.role === 'everyone') {
                options.disableEveryone = false;
                options.content = '@everyone ' + options.content;
            } else if (opt.role === 'here') {
                options.disableEveryone = false;
                options.content = '@here ' + options.content;
            } else {
                options.content = `<@&${opt.role}> ` + options.content;
            }
        }

        return [wh, options];
    }

    /**
     * Execute a webhook for the given guild
     * Update cached data if the webhook doesn't exist anymore
     *
     * @param {String} gID
     * @param {Object} opt - { chan: '', role: '' }
     * @param {Object} wh - Webhook Object
     * @param {Object} options - data to send
     * @returns {Promise<Boolean>} true if it works / false if not
     * @memberof RssAPI
     */
    async executeWH(gID, opt, wh, options) {
        try {
            await this.bot.executeWebhook(wh.id, wh.token, options);
            return true;
        } catch (err) {
            delete this.guilds[gID];
            delete this.handler.guilds.get(gID)[opt.chan];
            return false;
        }
    }
}

export default RssAPI;
