const blogModel = require("../../models/blog.m");

exports.serviceRequestForm = async (req, res) => {
  return res.render("pages/services-request-form", { pd: {} });
};

exports.serviceFaq = async (req, res) => {
	const page = await blogModel.getPageBySlug("services-faqs");
	return res.render("pages/services-faq", { pd: { page } });
};

exports.serviceVerify = async (req, res) => {
  let { id } = req.query;
  return res.render("pages/services-request-verify", { pd: {id} });
};