require("dotenv").config();
const apiMail = require("../email/apiErrorEmail");
const dbMail = require("../email/dbErrorEmail");
const environment = process.env.NODE_ENV;

exports.apiError = (res, error) => {
  if (environment !== "production") {
    res.status(500).json({
      title: "Server Error",
      message: error.message,
      type: "danger",
    });
    console.log(error);
  } else {
    res.status(500).json({
      title: "Server Error",
      message: "Ex while rendering error",
      type: "danger",
    });
    apiMail.sendEmail(error);
  }
};

exports.databaseError = (error) => {
  if (environment !== "production") {
    console.log(error);
  } else {
    dbMail.sendEmail(error);
  }
};
