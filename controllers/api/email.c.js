const { sendMail } = require("../../util/mailer");

exports.testEmail = async (req, res, next) => {
	try {
		const emailResult = await sendMail({
			to: "spidernet12@gmail.com",
			subject: "Test Email",
			text: "Test Email Text",
			html: "<strong>Test Email HTML</strong>"
		});
		res.json({
			emailResult
		});
	} catch (err) {
		next(err);
	}
};
