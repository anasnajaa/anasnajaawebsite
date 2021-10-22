require('dotenv').config();
const environment = process.env.NODE_ENV;
const stage = require('../config/index')[environment];
module.exports = {
    developers: stage.emails.developers,
    databaseAdmins: stage.emails.databaseAdmins,
    support: stage.emails.support,
    info: stage.emails.info,
    payment: stage.emails.payment,
}