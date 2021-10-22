require('dotenv').config();
const environment = process.env.NODE_ENV;

module.exports = (tag, object)=>{
    if(environment!=="production"){
        console.log(tag, object);
    }
};