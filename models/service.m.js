const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    serviceId: { type: Number, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: false },
    mobile: { type: String, required: false },
    verified: { type: Boolean, required: false },
    otp: { type: String, required: false },
    otpTrials: { type: Number, required: false },
}, 
{ timestamps: true, collection: 'serviceRequest'});


module.exports = mongoose.model('serviceRequest', schema);