require("dotenv").config();
const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];
const client = require("twilio")(stage.sms.accountSid, stage.sms.authToken);
const smsModel = require("../../models/sms.m");
const { merge } = require("lodash");
const { apiError } = require("../../util/errorHandler");

const smsUpdateHookURL = stage.publicRootUrl + "/api/v1/hooks/sms/update";

exports.getMessages = async (req, res) => {
  try {
    const messages = await smsModel.find({}).lean();
    res.status(200).json({ messages });
  } catch (error) {
    apiError(res, error);
  }
};

exports.sendMessage = (type, to, body) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const message = await new smsModel({
          type,
          to,
          body,
          date_created: new Date(),
          date_updated: null,
          date_sent: null,
          SmsStatus: "queued",
        }).save();

        const response = await client.messages.create({
          from: stage.sms.fromNumber,
          statusCallback: smsUpdateHookURL,
          body,
          to,
        });

        message.date_sent = new Date();
        merge(message, response);
        await message.save();

        resolve({ serviceResponse: response, addedRecord: message });
      } catch (error) {
        reject(res, error);
      }
    })();
  });
};

exports.sendTestMessage = async (req, res) => {
  const type = "test";
  const to = stage.mobiles.info;
  const body = "Test Message \n Hello";

  try {
    const message = await new smsModel({
      type,
      to,
      body,
      date_created: new Date(),
      date_updated: null,
      date_sent: null,
    }).save();

    const response = await client.messages.create({
      from: stage.sms.fromNumber,
      statusCallback: smsUpdateHookURL,
      body,
      to,
    });

    message.date_sent = new Date();
    merge(message, response);
    await message.save();

    return res.status(200).json({
      title: "Success",
      message: "Message Sent",
      type: "success",
    });
  } catch (error) {
    apiError(res, error);
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const sms = req.body;
    sms.date_updated = new Date();
    const result = await smsModel.updateOne({ sid: sms.SmsSid }, sms).exec();
    res.status(200).json({ status: 1, result });
  } catch (error) {
    apiError(res, error);
  }
};
