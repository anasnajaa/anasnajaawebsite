const { v4 } = require("uuid");
const { contentServer } = require("../../util/awake");
const { isCaptchaValid } = require("../../util/captcha");

exports.awake = async (req, res) => {
  const contentServerAwake = await contentServer();
  res.json({
    id: v4(),
    contentServerAwake,
  });
};

exports.captcha = async (req, res) => {
  const key = req.query.key;
  const captchaResult = await isCaptchaValid(key);
  res.json({
    isValid: captchaResult,
  });
};
