const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];

exports.dashboard = async (req, res, next) => {
	try {
		return res.render("pages/admin-dashboard", { pd: { user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.library = async (req, res, next) => {
	try {
		return res.render("pages/admin-library", { pd: { user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.libraryView = async (req, res, next) => {
	try {
		return res.render("pages/admin-library-view", { pd: { user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.libraryEdit = async (req, res, next) => {
	try {
		return res.render("pages/admin-library-edit", { pd: { user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.libraryDelete = async (req, res, next) => {
	try {
		return res.render("pages/admin-library-delete", { pd: { user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		return res.render("pages/admin-login", {
			pd: { user: req.user, googleSiteKey: stage.googleSiteKey }
		});
	} catch (err) {
		next(err);
	}
};

exports.profile = async (req, res, next) => {
	try {
		return res.render("pages/admin-profile", {
			pd: { user: req.user }
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

		return res.cookie("token", "", options).redirect("/");
	} catch (err) {
		next(err);
	}
};
