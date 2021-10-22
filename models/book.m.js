const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: false },
    thumbnail_url: { type: String, required: true },
    likes: { type: Number, required: false },
    date_created: { type: Date, required: false }
}, 
{ timestamps: false, collection: 'books'});


module.exports = mongoose.model('books', schema);