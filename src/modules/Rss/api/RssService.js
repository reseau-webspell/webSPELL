'use strict';

import RssSchema from '../models/RssSchema';

/**
 * Interface to interact with Database (RSS Schema)
 *
 * @author KhaaZ
 *
 * @class RssService
 */
class RssService {
    static async getSchema() {
        try {
            let schema = await RssSchema.findOne({ ID: '1' });
            if (!schema) {
                schema = await await this.initSchema();
            }
            return schema;
        } catch (err) {
            try {
                return await this.initSchema();
            } catch (e) {
                return e;
            }
        }
    }

    static initSchema() {
        return RssSchema.findOneAndUpdate(
            {
                ID: '1',
            },
            {
                ID: '1',
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
    }

    static updateSchema(feeds, guilds) {
        return RssSchema.findOneAndUpdate(
            {
                ID: '1',
            },
            {
                feeds,
                guilds,
            },
            {
                new: true,
                upsert: true,
            }
        );
    }

    static updateFeeds(feeds) {
        return RssSchema.findOneAndUpdate(
            {
                ID: '1',
            },
            {
                $set: {
                    feeds,
                },
            },
            {
                new: true,
            }
        );
    }

    static updateGuilds(guilds) {
        return RssSchema.findOneAndUpdate(
            {
                ID: '1',
            },
            {
                $set: {
                    guilds,
                },
            },
            {
                new: true,
            }
        );
    }

    static updateDB(schema) {
        return schema.save();
    }
}

export default RssService;
