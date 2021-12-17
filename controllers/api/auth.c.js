const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];

const { generateToken } = require("../../util/jwtAuth");
const { isCaptchaValid } = require("../../util/captcha");
const userModel = require("../../models/user.m");
const v = require("validator");
const bcrypt = require("bcrypt");

const passwordMatch = (inputPassword, hashedPassword) => {
	return bcrypt.compareSync(inputPassword, hashedPassword);
};

const generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.login = async (req, res, next) => {
	try {
		let errors = {};
		const { username, password, captcha, setCookie } = req.body;

		if (environment === "production") {
			const captchaResult = await isCaptchaValid(captcha);
			if (!captchaResult) errors["captcha"] = ["Captcha is not valid, please try again"];
		}

		if (!v.isEmail(username)) errors["username"] = ["Invalid Username"];
		if (v.isEmpty(password)) errors["password"] = ["Required Field"];
		if (Object.keys(errors).length) return res.status(422).json({ errors });

		let user = await userModel.findOne({ username }).lean();

		if (user === null) {
			errors["username"] = ["Invalid Username"];
			return res.status(422).json({ errors });
		}

		if (!user.isActive) {
			errors["username"] = ["User is not active."];
			return res.status(422).json({ errors });
		}

		if (!passwordMatch(password, user.password)) {
			errors["password"] = ["Invalid Password"];
			return res.status(422).json({ errors });
		}

		const token = await generateToken(user);

		if (setCookie) res.cookie("token", token, stage.jwtCookieOptions);

		delete user.password;

		return res.status(200).json({
			token,
			user
		});
	} catch (err) {
		next(err);
	}
};

exports.logout = async (req, res, next) => {
	try {
		const options = { ...stage.jwtCookieOptions };
		options.expires = new Date(Date.now());
		options.maxAge = 0;
		options.overwrite = true;

		return res.status(200).cookie("token", "", options).json({
			title: "Success",
			message: "Logout successful",
			type: "success"
		});
	} catch (err) {
		next(err);
	}
};
