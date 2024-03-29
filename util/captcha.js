require("dotenv").config();
const fetch = require('isomorphic-fetch');
const googleRecaptchSecretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
const googleCaptchEndpoint = "https://www.google.com/recaptcha/api/siteverify";
exports.isCaptchaValid = async (key) => {
  try {
    // eslint-disable-next-line no-undef
    const response = await fetch(googleCaptchEndpoint, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: `secret=${googleRecaptchSecretKey}&response=${key}`,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
