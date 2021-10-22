const { isEmpty } = require('lodash');

const { 
    vEmail, 
    vEmpty
} = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const cr = require('../../locales/codedResponses');
const {completeCustomerProfileSetup} = require('../../models/customer_service/completeCustomerProfileSetup');
const serviceRequestEmail = require('../../email/serviceRequestReceived');
const paramsMissing = require('../../util/methodParamCheck');

const fields = [
    { key: "token", required: true},
    { key: "firstName", required: true },
    { key: "lastName", required: true },
    { key: "email", required: true },
    { key: "serviceId", required: true },
    { key: "description", trequired: true },
    { key: "joinMailing", trequired: true },
];

/* 
this function will:
- update user info 
- send confirmation email to the user
*/
module.exports = async (req, res)=>{
    const t = req.__;
    if(paramsMissing(t, fields, req.body, res)){ return; }
    try {
        let errors = {};
        const { 
            token,
            firstName, 
            lastName, 
            email,
            serviceId,
            description,
            joinMailing
        } = req.body;

        vEmpty("token", errors, token);
        vEmpty("firstName", errors, firstName);
        vEmpty("lastName", errors, lastName);

        vEmail("email", errors, email);
        vEmpty("serviceId", errors, serviceId);

        if(!isEmpty(errors)){
            res.status(422).json({
                messages: [cr.user_input_errors(t)], 
                errors
            });
            return;
        }

        const customerDetails = await completeCustomerProfileSetup({
            first_name: firstName,
            last_name: lastName,
            email,
            join_mailing: joinMailing,
            serviceId,
            description,
            token
        });

        await serviceRequestEmail({
            email: customerDetails.customer.email, 
            name: customerDetails.customer.first_name,
            serviceTitle: customerDetails.service.name});

        res.status(200).json({ 
            messages: [""],
            data: {
                customerDetails
            }
        });
    } catch (error) {
        apiError(t, res, error);
    }
};