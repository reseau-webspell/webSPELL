'use strict';

import {
    Base,
    Collection,
} from 'axoncore';

import apisConf from '../apis.json';

import RssParser from 'rss-parser';

import RssService from './RssService';
import RssAPI from './RssAPI';

import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
const readFileP = promisify(readFile);

/**
 * Handle
 *
 * @author KhaaZ
 *
 * @class APIHandler
 */
class APIHandler extends Base {
    constructor(module) {
        super(module.axon);

        this._module = module;
        /** Parser used by every API */
        this.parser = new RssParser();

        /** All Guilds
         * { GuildID => { ChanID: {webhook} } }
         */
        this.guilds = new Collection();

        /** All Apis { FeedURL => APIObject } */
        this.apis = new Collection(RssAPI);

        this.time = 300000;
        this.ready = false;
    }

    get module() {
        return this._module;
    }

    getAPI(feed) {
        return this.apis.get(feed.toLowerCase()) || this.apis.find(a => a.name && a.name.toLowerCase() === feed.toLowerCase());
    }

    /**
     * Initialise the API Handler
     * Create all APIS
     *
     * @returns
     * @memberof APIHandler
     */
    async init() {
        if (this.ready) {
            return;
        }

        // get schema from DB
        let schema;
        try {
            schema = await RssService.getSchema();
        } catch (err) {
            this.Logger.emerg('[RSS MODULE] - Database Error\n' + err.stack);
        }

        // create all API's
        for (const feed of schema.feeds) {
            this.apis.set(feed.url.toLowerCase(), new RssAPI(this, feed));
        }

        // setup all guilds
        for (const [key, value] of Object.entries(schema.guilds)) {
            this.guilds.set(key, value);
        }

        await this.updateFeeds(apisConf);

        this.ready = true;
        this.Logger.notice('[RSS MODULE] - All API\'s ready');

        await this.run();
        this.timer();
    }

    /**
     * Timer method
     * Perpetual loop - run all API request every this.time
     *
     * @memberof APIHandler
     */
    timer() {
        setInterval(async() => {
            if (!this.ready) {
                return;
            }
            this.Logger.verbose('RSS FEED - API request.');
            await this.run();
        }, this.time);
    }

    /**
     * Loop though all APIs and call apis.run
     * Run all APIs / query feeds / post webhooks
     * Update Database if there are changes to do
     *
     * @memberof APIHandler
     */
    async run() {

        let res = false;
        for (const api in this.apis.values()) {
            console.log('======= ' + api.name + ' =======\n');
            res = await api.run()

            console.log(' sleep \n');
            await this.axon.Utils.sleep(1000);
        }

        //If one send back true, it means that it updated last => DB update
        if (res) {
            await RssService.updateSchema(
                this.apis.map(a => a.toMongoFormat()),
                this.guilds.toObject(),
            );
        }

        // const promises = this.apis.map(a => a.run());
        // const result = await Promise.all(promises);

        // // If one send back true, it means that it updated last => DB update
        // if (result.includes(true)) {
        //     await RssService.updateSchema(
        //         this.apis.map(a => a.toMongoFormat()),
        //         this.guilds.toObject(),
        //     );
        // }
    }

    //
    // ****** UPDATE JSON ******
    //

    /**
     * Dynamically read from json Conf (Feeds list)
     * Allow live update
     *
     * @memberof APIHandler
     */
    async updateFeedsConf() {
        try {
            const data = await readFileP(join(__dirname, '../apis.json'), 'utf8');
            const dataJ = JSON.parse(data);
            await this.updateFeeds(dataJ);
            return true;
        } catch (err) {
            this.Logger.error('[RSS MODULE] - Reading apis.json Error\n' + err.stack);
            return false;
        }
    }

    /**
     * Loop through all feeds in the apis.json data
     * check whereas that feed is already registered or not and register it if needed
     * Update Database if a new feed was added.
     *
     * @param {Object} data
     * @memberof APIHandler
     */
    updateFeeds(data) {
        for (const feed of data) {
            const exist = this.getAPI(feed.url);
            if (exist) {
                exist.name = feed.name;
                exist.image = feed.image;
            } else {
                this.apis.set(feed.url.toLowerCase(), new RssAPI(this, feed));
            }
        }
        /** DB Update */
        RssService.updateFeeds(this.apis.map(a => a.toMongoFormat()));
    }

    /**
     * Push last article for this feed in the specified guild
     * Only works via feed name (feed url or feed name in case it's a global feed)
     *
     * @param {String} feed
     * @param {String} gID
     * @returns {Promise<Boolean>} true if it worked / false if not
     * @memberof APIHandler
     */
    async pushLast(feed, gID) {
        const api = this.getAPI(feed);
        if (!this.guilds.has(gID) || !api) {
            return false;
        }
        const res = await api.pushLast(gID);
        if (!res) {
            RssService.updateGuilds(this.guilds.toObject());
        }
        return true;
    }

    //
    // ****** API MANAGEMENT ******
    //

    /**
     * Create a RSS API, pass it in this.apis
     * Update DB
     *
     * @param {Object} feed - feed obj { url: '', name: '', image: ''}
     * @returns {Boolean} true if API created
     * @memberof APIHandler
     */
    async createApi(feed) {
        let api = this.getAPI(feed.url);
        if (api) { // api already exist
            return false;
        }
        api = new RssAPI(this, feed);
        this.apis.set(feed.url.toLowerCase(), api);

        /** DB update */
        const schema = await RssService.getSchema();

        schema.feeds.push(api);

        schema.markModified('feeds');
        RssService.updateDB(schema);
        return true;
    }

    /**
     * update an API from cache + DB
     *
     * @param {String} feed - feed Object {url: '', name: '', image: ''}
     * @param {Boolean} true if removed
     * @memberof APIHandler
     */
    async updateApi(feed) {
        const api = this.getAPI(feed.url);
        if (!api) { // api doesn't exist
            return false;
        }
        feed.name && (api.name = feed.name);
        feed.image && (api.image = feed.image);

        /** DB update */
        const schema = await RssService.getSchema();

        const tmpFeeds = schema.feeds.filter(a => a.url !== api.url);
        feed.name && (tmpFeeds.name = feed.name);
        feed.image && (tmpFeeds.image = feed.image);

        schema.markModified('feeds');
        RssService.updateDB(schema);
        return true;
    }

    /**
     * Delete an API from cache + DB
     *
     * @param {String} feed - feed name or feed url
     * @param {Boolean} true if removed
     * @memberof APIHandler
     */
    async deleteApi(feed) {
        const api = this.getAPI(feed);
        if (!api) { // api doesn't exist
            return false;
        }
        this.apis.delete(api.url);

        /** DB update */
        const schema = await RssService.getSchema();

        const tmpFeeds = schema.feeds.filter(a => a.url !== api.url);
        schema.feeds = tmpFeeds;

        schema.markModified('feeds');
        RssService.updateDB(schema);
        return true;
    }

    //
    // ****** SUBSCRIBE / UNSUBSCRIBE ******
    //

    /**
     * Get or create webhook
     * Update the cache
     *
     * @param {Object<Message>} msg
     * @param {Object<Guild>} guild
     * @param {Object<Channel>} chan
     * @returns {Promise<Webhook|null>} The webhook object or null if error (no perms)
     * @memberof APIHandler
     */
    async getCreateWH(msg, guild, chan) {
        let gObj = this.guilds.get(guild.id);
        let webhook = null;

        if (!gObj) {
            this.guilds.set(guild.id, {});
            gObj = this.guilds.get(guild.id);
        } else {
            webhook = gObj[chan.id];

            /** Test Webhook validity */
            if (webhook) {
                try {
                    await this.bot.getWebhook(webhook.id, webhook.token);
                } catch (err) {
                    webhook = null;
                }
            }
        }

        if (!webhook) { // no valid webhook
            /** Create webhook */
            try {
                const { id, token } = await this.bot.createChannelWebhook(chan.id, {
                    name: `${this.bot.user.username} - RSS`,
                }, `WebSpell RSS feed.`);
                webhook = { id, token };
            } catch (err) {
                this.sendError(msg.channel, 'Missing `manage webhooks` permission in that channel!');
                return null;
            }

            gObj[chan.id] = webhook;
        }

        return webhook;
    }

    /**
     * Subscribe a guild to a feed
     * Do all necessary checker, create the webhook (getCreateWH)
     * Update cache
     * Update the DB
     *
     * @param {Object<Message>} msg
     * @param {Object} feed
     * @param {Object<Guild>} guild
     * @param {Object<Channel>} chan
     * @returns {Promise<Boolean>} true if worked
     * @memberof APIHandler
     */
    async subscribeFeed(msg, feed, guild, chan) {
        let api = this.getAPI(feed);

        if (!api) { // no existing API
            /** check feed validity */
            try {
                await this.parser.parseURL(feed);
            } catch (err) {
                // not a valid feed
                this.sendError(msg.channel, 'Not a valid RSS feed URL!');
                return false;
            }

            /** Set the API */
            api = new RssAPI(this, { url: feed });

            this.apis.set(feed.toLowerCase(), api);
        }

        /** Get or create the webhook */
        const wh = await this.getCreateWH(msg, guild, chan);
        if (!wh) {
            return false;
        }

        /** Subscribe the guild to the feed */
        const existing = api.guilds[guild.id];
        api.guilds[guild.id] = existing
            ? { chan: chan.id, role: existing.role }
            : { chan: chan.id, role: null };

        /** DB update */
        const schema = await RssService.getSchema();

        const schemaAPI = schema.feeds.find(f => f.url === api.url);
        if (schemaAPI) {
            schemaAPI.guilds = api.guilds;
        } else {
            schema.feeds.push(api.toMongoFormat());
        }
        schema.guilds[guild.id] = this.guilds.get(guild.id);

        schema.markModified('feeds');
        schema.markModified('guilds');
        await RssService.updateDB(schema);

        return true;
    }

    /**
     * Unsubscribe to a feed
     * necessary checkers
     * Update all cache
     * Update DB
     *
     * @param {String} feedURL
     * @param {String} gID
     * @returns {Promise<Boolean>}
     * @memberof APIHandler
     */
    async unsubscribeFeed(feedURL, gID) {
        const api = this.getAPI(feedURL);
        if (!api) { // api doesn't exist
            return false;
        }

        if (!api.guilds[gID]) { // guild not subscribed
            return false;
        }

        delete api.guilds[gID];

        /** DB update */
        const schema = await RssService.getSchema();

        const schemaAPI = schema.feeds.find(a => a.url === api.url);

        schemaAPI && delete schemaAPI.guilds[gID];

        schema.markModified('feeds');
        schema.markModified('guilds');
        RssService.updateDB(schema);

        return true;
    }

    /**
     * Update the role to mention for a feed
     * Either everyone, here, custom role
     *
     * @param {String} feed
     * @param {String} gID
     * @param {String} role - "everyone" / "here" / "roleID"
     * @returns {Promise<Boolean>} true if worked
     * @memberof APIHandler
     */
    async updateRoleFeed(feed, gID, role = null) {
        const api = this.getAPI(feed);
        if (!api) {
            return false;
        }
        const guild = api.guilds[gID];
        if (!guild) {
            return false;
        }

        guild.role = role;

        /** DB update */
        const schema = await RssService.getSchema();

        const schemaAPI = schema.feeds.find(a => a.url === api.url);
        schemaAPI /* && schemaAPI.guilds[gID]*/ && (schemaAPI.guilds[gID].role = role);

        schema.markModified('feeds');
        RssService.updateDB(schema);

        return true;
    }
}

export default APIHandler;
