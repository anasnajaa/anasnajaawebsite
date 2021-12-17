const { v4 } = require("uuid");
const { contentServer } = require("../../util/awake");
const { isCaptchaValid } = require("../../util/captcha");

exports.awake = async (req, res, next) => {
	try {
		const contentServerAwake = await contentServer();
		res.json({
			id: v4(),
			contentServerAwake
		});
	} catch (err) {
		next(err);
	}
};

exports.captcha = async (req, res, next) => {
	try {
		const key = req.query.key;
		const captchaResult = await isCaptchaValid(key);
		res.json({
			isValid: captchaResult
		});
	} catch (err) {
		next(err);
	}
};
