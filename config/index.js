const { merge } = require("lodash");
const sharedSettings = {
	saltingRounds: 10,
	workers: process.env.WEB_CONCURRENCY || 1,
	mongoUri: process.env.ATLAS_URI_RW,
	mailer: {
		user: process.env.EMAIL_USER,
		password: process.env.EMAIL_PASS,
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT
	},
	sms: {
		accountSid: process.env.TWILIO_ACC_SID,
		authToken: process.env.TWILIO_AUTH,
		fromNumber: process.env.TWILIO_FROM
	},
	jwtOption: { expiresIn: "1d", issuer: process.env.JWT_ISSUER },
	jwtSecret: process.env.JWT_SECRET,
	googleRecaptch: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
	googleSiteKey: process.env.GOOGLE_SITE_KEY,
	sendGridApiKey: process.env.SENDGRID_API_KEY,
	emails: {
		developers: process.env.EMAIL_DEV,
		databaseAdmins: process.env.EMAIL_DBADMIN,
		support: process.env.EMAIL_SUPPORT,
		info: process.env.EMAIL_INFO,
		payment: process.env.EMAIL_PAYMENT
	},
	mobiles: {
		info: process.env.INFO_MOBILE
	},
	publicRootUrl: process.env.PUBLIC_ROOT_URL,
	blog: {
		apiKey: process.env.BLOG_API_KEY,
		apiUrl: process.env.BLOG_API_URL
	},
	aws: {
		accessKey: process.env.S3_ACCESS_KEY_ID,
		secretKey: process.env.S3_ACCESS_SECRET_KEY,
		bucketName: process.env.S3_BUCKET_NAME,
		bucketRegion: process.env.S3_BUCKET_REGION
	}
};

const developmentSettings = {
	port: process.env.PORT || 5000,
	corsOptions: {
		origin: "*",
		credentials: true
	},
	jwtCookieOptions: {
		expires: new Date(Date.now() + 604800000),
		secure: false,
		httpOnly: true
	},
	jwtSecure: false,
	jwtCookieExpiry: new Date(Date.now() + 604800000)
};

const productionSettings = {
	port: process.env.PORT || 80,
	corsOptions: {
		origin: [process.env.CORS_URL],
		credentials: true
	},
	jwtCookieOptions: {
		expires: new Date(2147483647000),
		secure: true,
		httpOnly: true,
		sameSite: "None"
	},
	jwtSecure: true,
	jwtCookieExpiry: new Date(2147483647000)
};

module.exports = {
	development: merge({ ...sharedSettings }, developmentSettings),
	production: merge({ ...sharedSettings }, productionSettings)
};
