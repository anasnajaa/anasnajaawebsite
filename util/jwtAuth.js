const environment = process.env.NODE_ENV;
const stage = require("../config/index")[environment];
const jwt = require("jsonwebtoken");

exports.generateToken = async (user) => {
	let token = null;
	try {
		token = jwt.sign(user, stage.jwtSecret, stage.jwtOption);
	} catch (error) {
		token = null;
		console.log(error);
	}
	return token;
};

exports.decryptedToken = (cookies) => {
	try {
		const jwtToken = cookies.token || null;
		if (jwtToken) {
			return jwt.verify(jwtToken, stage.jwtSecret, stage.jwtOption);
		}
	} catch (error) {
		console.log(error);
	}
	return null;
};
