'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RssSchema = new Schema({
    /** Index */
    ID: { type: String, required: true, index: true}, // ID
    
    SplashtoonWH: { type: Array, default: [] },
    NintendozWH: { type: Array, default: [] },

    SplashtoonLast: { type: String, default: '' },
    NintendozLast: { type: String, default: '' }
    
    /** 
     * guild Object structure 
     * {
     *    gID:
     *    webhookID:
     *    webhookToken:
     *    enabled:
     *  }
     */
}, {
    strict: false,
    minimize: false
});

export default mongoose.model('RssSchema', RssSchema);
