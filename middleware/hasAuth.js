const environment = process.env.NODE_ENV;
const stage = require("../config/index")[environment];
const jwt = require("jsonwebtoken");

const removeTokenCookie = async (res) => {
	const options = { ...stage.jwtCookieOptions };
	options.expires = new Date(Date.now());
	options.maxAge = 0;
	options.overwrite = true;
	res.cookie("token", "", options);
};

const retrieveJwtToken = (req, res) => {
	return new Promise((resolve, reject) => {
		(async () => {
			try {
				const jwtToken = req.cookies.token || null;
				if (jwtToken === null) return reject(new Error("Auth_Unauthorized"));
				const token = jwt.verify(jwtToken, stage.jwtSecret, stage.jwtOption);
				const exp = new Date(token.exp);
				const today = new Date();
				if (today > exp) return resolve(token);
				removeTokenCookie(res);
				reject(new Error("Auth_Expired"));
			} catch (err) {
				if (err.message === "invalid signature") removeTokenCookie(res);
				reject(err);
			}
		})();
	});
};

exports.retrieveJwtToken = async (req, res) => {
	try {
		const user = await retrieveJwtToken(req, res);
		return user;
	} catch (err) {
		return null;
	}
};

exports.isLoggedOut = async (req, res, next) => {
	try {
		const jwtToken = req.cookies.token || null;
		if (jwtToken) throw new Error("Auth_Unauthorized");
		return next();
	} catch (err) {
		next(err);
	}
};

exports.isLoggedIn = async (req, res, next) => {
	try {
		const user = await retrieveJwtToken(req, res);
		req.user = user;
		return next();
	} catch (err) {
		next(err);
	}
};

exports.userIfExist = async (req, res, next) => {
	try {
		const user = await retrieveJwtToken(req, res);
		req.user = user;
		return next();
	} catch (err) {
		req.user = null;
		next();
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const user = await retrieveJwtToken(req, res);
		for (let i in user.roles) {
			if (user.roles[i] === "admin") {
				req.user = user;
				return next();
			}
		}
		throw new Error("Auth_Unauthorized");
	} catch (err) {
		next(err);
	}
};
