require('dotenv').config();
const environment = process.env.NODE_ENV;
const { isEmpty } = require('lodash');
const { vMobile, vCaptcha } = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const smsService = require('../sms.c');
const {getCustomerAuthCode} = require('../../models/customer_service/getCustomerAuthCode');
const cr = require('../../locales/codedResponses');
const paramsMissing = require('../../util/methodParamCheck');

const sendAuthSMS = async (t, mobileWithCountryCode, verificationCode) => {
    if(environment === "production"){
        return await smsService.sendMessage(
            "verification",
            mobileWithCountryCode, 
            `${t("your_verification_code")}: ${verificationCode}`);
    }
    return null;
}

const fields = [
    { key: "captcha", required: true },
    { key: "mobile", required: true },
    { key: "countryCode", required: true }
];

/* 
this function will:
- verifiy user's captcha against google servers
- create intial user record with mobile and auth code
*/
module.exports = async (req, res) => {
    const t = req.__;
    if(paramsMissing(t, fields, req.body, res)){ return; }
    try {
        let errors = {};

        const {
            captcha,
            mobile,
            countryCode
        } = req.body;
        
        const mobileWithCountryCode = countryCode + mobile;

        vMobile("mobile", errors, mobileWithCountryCode);

        if(environment === "production"){
            await vCaptcha("captcha", errors, captcha);
        }

        if(!isEmpty(errors)){
            res.status(422).json({
                messages: [cr.user_input_errors(t)], 
                errors
            });
            return;
        }

        const customerAndLog = await getCustomerAuthCode(mobileWithCountryCode);

        if(environment === "production"){
            await sendAuthSMS(t, mobileWithCountryCode, customerAndLog.customer.auth_code);
            res.status(200).json({
                messages: [cr.verification_code_mobile_sent(t)]
            });
        } else {
            res.status(200).json({
                messages: [cr.verification_code_mobile_sent(t)],
                data: customerAndLog
            });
        }
    } catch (error) {
        apiError(t, res, error);
    }
};