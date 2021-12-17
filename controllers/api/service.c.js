const serviceModel = require("../../models/service.m");
const { sendMail } = require("../../util/mailer");
const { isCaptchaValid } = require("../../util/captcha");
const v = require("validator");

exports.verifyServiceOtp = async (req, res, next) => {
	try {
		const { requestId } = req.params;
		let { otp } = req.body;
		const errors = {};

		if (v.isEmpty(requestId)) errors["requestId"] = ["Required Field"];

		if (v.isEmpty(otp)) errors["otp"] = ["Required Field"];

		if (Object.keys(errors).length) return res.status(402).json(errors);

		const request = await serviceModel.findById(requestId);

		if (request === null)
			return res.status(400).json({
				title: "Error",
				message: "Request not found",
				type: "danger"
			});

		if (request.verified)
			return res.status(400).json({
				title: "Error",
				message: "Request already verified",
				type: "danger"
			});

		request.verified = true;
		request.otp = null;

		await request.save();

		sendMail({
			to: "anas@najaa.org",
			subject: `A.N - New Request: ${request.name || request.email}`,
			text: `
            Hello Anas,
            New request was submitted from anas.najaa.org
            Request Details:
            ID: ${request._id}
            Service: ${request.serviceId}
            Name: ${request.name || ""}
            Email: ${request.email}
            Mobile: ${request.mobile || ""}
            Description:
            ${request.description}`,
			html: `
            Hello Anas,<br/>
            New request was submitted from anas.najaa.org<br/>
            Request Details:<br/>
            ID: ${request._id}<br/>
            Service: ${request.serviceId}<br/>
            Name: ${request.name || ""}<br/>
            Email: ${request.email}<br/>
            Mobile: ${request.mobile || ""}<br/>
            Description:<br/>
            ${request.description}`
		});

		sendMail({
			to: request.email,
			subject: `A.N - Request Forwarded`,
			text: `
            Dear ${request.name || request.email},
            Thank you!
            Your request has been forwarded. 
            I'll get in touch with you within 2 business days.
            Regards,
            Anas Najaa`,
			html: `
            Dear ${request.name || request.email},<br/>
            Thank you!<br/>
            Your request has been forwarded. <br/>
            I'll get in touch with you within 2 business days.<br/>
            Regards,<br/>
            Anas Najaa`
		});

		return res.status(200).json({
			title: "Success",
			message: "Verification Successful",
			type: "success"
		});
	} catch (err) {
		next(err);
	}
};

exports.newServiceRequest = async (req, res, next) => {
	try {
		let { serviceId, email, description, name, mobile, captcha } = req.body;
		const errors = {};

		name = name === "" ? null : name;
		mobile = mobile === "" ? null : mobile;

		if (mobile) mobile = `+965${mobile}`;

		if (!v.isEmail(email)) errors["email"] = ["Invalid Email"];

		if (v.isEmpty(description)) errors["description"] = ["Required Field"];

		if (!v.isInt(serviceId + "", { min: 1, max: 3 }))
			errors["serviceId"] = ["Invalid Selection"];

		if (mobile && !v.isMobilePhone(mobile, ["ar-KW"]))
			errors["mobile"] = ["Mobile number is not valid"];

		const captchaResult = await isCaptchaValid(captcha);

		if (!captchaResult) {
			errors["captcha"] = ["Captcha is not valid, please try again"];
		}

		if (Object.keys(errors).length) return res.status(402).json(errors);

		const otp = Math.floor(Math.random() * 9999);

		const newServiceRequest = await new serviceModel({
			serviceId,
			email,
			description,
			name,
			mobile,
			verified: false,
			otp: otp,
			otpTrials: 1
		});

		await newServiceRequest.save();

		const emailResult = await sendMail({
			to: email,
			subject: "A.N - Request Received",
			text: `Dear ${name || email},
        Your request has been submitted successfully. 
        To proceed further, please verify your identity by using the following OTP code: 
        ${otp}
        Regards,
        Anas Najaa`,
			html: `
        Dear ${name || email},<br/>
        Your request has been submitted successfully. <br/>
        To proceed further, please verify your identity by using the following OTP code: <br/r>
        <b>${otp}</b><br/>
        Regards,<br/>
        Anas Najaa`
		});

		return res.status(200).json({ id: newServiceRequest._id });
	} catch (err) {
		next(err);
	}
};
