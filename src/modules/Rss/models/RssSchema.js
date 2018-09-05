'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RssSchema = new Schema({
    /** Index */
    ID: { type: String, required: true, index: true }, // Guild ID

    /**
     * One webhook per channel
     *
     * webhooks: { chanID: { id: "", token: "" }, chanID: { id: "", token: "" } }
     */
    webhooks: { type: Object, default: {} },

    /**
     * All feeds with channel, enabled state, everyone option
     *
     * feeds: { feedName: { chan: "chanID", enabled: true, everyone: true } }
     */
    feeds: { type: Object, default: {} },

}, {
    strict: false,
    minimize: false,
});

export default mongoose.model('RssSchema', RssSchema);
