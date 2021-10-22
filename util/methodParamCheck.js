const { isEmpty } = require('lodash');
const cr = require('../locales/codedResponses');
const missingFieldExist = (t, fields, body) => {
    const missingFields = {};
    for(i in fields){
        if(fields[i].required && !body.hasOwnProperty(fields[i].key)){ 
            missingFields[fields[i].key] = cr.this_field_is_required(t);
        }
    };
    return missingFields;
}

module.exports = (t, fields, body, res) => {
    const missingFields = missingFieldExist( t, fields, body);
    if(!isEmpty(missingFields)){
        res.status(400).json({
            messages: [cr.fields_missing(t)], 
            errors: missingFields
        });
        return true;
    }
    return false;
}