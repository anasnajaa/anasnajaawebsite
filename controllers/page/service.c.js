exports.serviceRequestForm = async (req, res) => {
  return res.render("pages/services-request-form", { pd: {} });
};

exports.serviceFaq = async (req, res) => {
  return res.render("pages/services-faq", { pd: {} });
};
