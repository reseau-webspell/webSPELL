'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RssSchema = new Schema({
    /** Index */
    ID: { type: String, default: '1', required: true, index: true }, // ID (formal)

    /**
     * All feeds available [GLOBAL]
     * Name and Image are not null if set up by bot owner
     *
     * Support both server feeds + global feeds.
     *  - global has a name and an image
     *  - server feeds are stored here so only one feed object is used
     *
     * Only one handler for all possible feed. (central subscription)
     *
     * All guild subscribed to this feed with the chan used and the role to mention (null if no mention)
     *
     *  [
     *      {
     *          url: "",
     *          last: "",
     *          name: null,
     *          image: null,
     *          guilds: {
     *              gID: { chan: chanID, role: null/roleID/everyone }
     *              gID: { chan: chanID, role: null/roleID/everyone }
     *          }
     *      }
     *  ]
     */
    feeds: { type: Array, default: [] },

    /**
     * All guilds that subscribed to at least one feed
     * List of chan with a webhook per guild
     * Chan associated with the webhook obj
     *
     *  {
     *      gID: {
     *          chanID: { id: "", token: "" },
     *          chanID: { id: "", token: "" }
     *      }
     *  }
     */
    guilds: { type: Object, default: {} },

}, {
    strict: false,
    minimize: false,
});

export default mongoose.model('RssSchema', RssSchema);
