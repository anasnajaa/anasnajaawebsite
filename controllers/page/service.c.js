const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];

const blogModel = require("../../models/blog.m");

exports.serviceRequestForm = async (req, res, next) => {
	try {
		return res.render("pages/services-request-form", {
			pd: { user: req.user, googleSiteKey: stage.googleSiteKey }
		});
	} catch (err) {
		next(err);
	}
};

exports.serviceFaq = async (req, res, next) => {
	try {
		const page = await blogModel.getPageBySlug("services-faqs");
		return res.render("pages/services-faq", { pd: { page, user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.serviceVerify = async (req, res, next) => {
	try {
		let { id } = req.query;
		return res.render("pages/services-request-verify", { pd: { id, user: req.user } });
	} catch (err) {
		next(err);
	}
};

exports.servicePage = async (req, res, next) => {
	try {
		const response = await blogModel.getPagesByInternalTag("services-page");
		const headerSectionId = "5f9040ca5d24f1001e75ee71";
		const teachingProgramming = "5f904a755d24f1001e75eeb5";
		const developmentProject = "5f904b025d24f1001e75eec3";
		const generalIt = "5f904bd15d24f1001e75eeed";

		const headerCard = response.pages.find((x) => x.id === headerSectionId);
		const services = response.pages.filter((x) => {
			return (
				x.id === teachingProgramming || x.id === developmentProject || x.id === generalIt
			);
		});

		return res.render("pages/services", { pd: { headerCard, services, user: req.user } });
	} catch (err) {
		next(err);
	}
};
