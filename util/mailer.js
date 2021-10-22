require("dotenv").config();
const environment = process.env.NODE_ENV;
const stage = require("../config/index")[environment];
const { merge } = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(stage.sendGridApiKey);

exports.sendMail = async (mailObject) => {
  try {
    const testEmailId = stage.emails.developers;
    const infoEmail = stage.emails.info;

    mailObject.to = environment !== "production" ? testEmailId : mailObject.to;

    const msg = merge({ from: infoEmail }, mailObject);
    const response = await sgMail.send(msg);

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
