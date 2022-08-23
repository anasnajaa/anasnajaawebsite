const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    text: { type: String, required: false },
    dateCreated: { type: Date, required: false },
    dateDue: { type: Date, required: false },
    dateClosed: { type: Date, required: false },
    reminder: { type: Boolean, required: false },
    userName: { type: String, required: false },
    category: { type: String, required: false },
    isCompleted: { type: Boolean, required: false }
}, 
{ timestamps: false, collection: 'task'});


module.exports = mongoose.model('task', schema);