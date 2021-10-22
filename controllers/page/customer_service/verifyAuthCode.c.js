const { isEmpty } = require('lodash');
const { 
    vEmpty, 
    vMobile
} = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const {verifyCustomerAuthCode} = require('../../models/customer_service/verifyCustomerAuthCode');
const cr = require('../../locales/codedResponses');
const mongoose = require('mongoose');
const paramsMissing = require('../../util/methodParamCheck');

const fields = [
    { key: "authCode", required: true },
    { key: "mobile", required: true },
    { key: "countryCode", required: true }
];

/* 
this function will:
- update user verification details 
- add a new user service record
- return added user, update info token and service id as a reference 
*/
module.exports = async (req, res) => {
    const t = req.__;
    if(paramsMissing(t, fields, req.body, res)){ return; }
    await mongoose.startSession();
    try {
        let errors = {};
        const { 
            authCode,
            mobile,
            countryCode
        } = req.body;

        const mobileWithCountryCode = countryCode + mobile;

        vEmpty("authCode", errors, authCode);
        vMobile("mobile", errors, mobileWithCountryCode);

        if(!isEmpty(errors)){
            res.status(422).json({
                messages: [cr.user_input_errors(t)], 
                errors
            });
            return;
        }

        const customerDetails = await verifyCustomerAuthCode(mobileWithCountryCode, authCode);

        res.status(200).json({
            messages: [cr.service_request_mobile_number_verified(t)],
            data: {
                token: customerDetails.customer.auth_code,
                id: customerDetails.customer.id
            }
        });
    } catch (error) {
        apiError(t, res, error);
    }
}