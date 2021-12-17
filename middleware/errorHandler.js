const { retrieveJwtToken } = require("../middleware/hasAuth");
const errorEmail = require("../email/prodErrorEmail");
const environment = process.env.NODE_ENV;

const e400 = {
	title: "400 Error",
	message: "Bad Request",
	type: "danger"
};

const e401 = {
	code: 401,
	title: "401 Error",
	message: "You don't have permission to perform this action.",
	type: "danger"
};

const e404 = {
	code: 404,
	title: "404 Error",
	message: "Requested resource is not found.",
	type: "danger"
};

const e440 = {
	code: 440,
	title: "440 Error",
	message: "Your session has expired.",
	type: "danger"
};

const e500 = {
	code: 500,
	title: "500 Error",
	message: "The Server was unable to process your action, please try again.",
	type: "danger"
};

module.exports = async (error, req, res, next) => {
	const user = await retrieveJwtToken(req, res);
	let e = {};

	switch (error.message) {
		case "General_Error":
			e = { ...e400 };
			break;
		case "Not_Found":
			e = { ...e404 };
			break;
		case "Auth_Expired":
			e = { ...e440 };
			break;
		case "Auth_Unauthorized":
			e = { ...e401 };
			break;
		default:
			e = { ...e500 };
			break;
	}

	if (environment !== "production" && e.code === 500) {
		e.stack = error.stack;
		console.error(error);
	}

	if (e.code === 500 && environment === "production") errorEmail.sendEmail(error);

	if (req.originalUrl.indexOf("/api/") > -1) return res.status(e.code).send(e);
	else return res.status(e.code).render("pages/error", { pd: { error: e, user } });
};
