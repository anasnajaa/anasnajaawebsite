//require('dotenv').config();
//const environment = process.env.NODE_ENV;

const knex = require('../config/db-connect');
 
module.exports = (trx, {entry, token}) => {
    try {
        if(trx){
            return knex('logs')
            .transacting(trx)
            .insert({entry, token})
            .returning(['id']);
        } else {
            return knex('logs')
            .insert({entry, token})
            .returning(['id']);
        }
    } catch (error) {
        // ignore
    }
};