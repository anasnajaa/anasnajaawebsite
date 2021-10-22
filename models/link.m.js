const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: false },
    url: { type: String, required: true },
    likes: { type: Number, required: false },
    tags: { type: Array, required: false },
    date_created: { type: Date, required: false }
}, 
{ timestamps: false, collection: 'links'});


module.exports = mongoose.model('links', schema);