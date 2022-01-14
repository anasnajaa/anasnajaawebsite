require("dotenv").config();
const path = require("path");
const AWS = require("aws-sdk");
const uuid = require("uuid");

const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];

exports.uploadFile = async (req, res, next) => {
	try {
		const { type } = req.query;

		AWS.config.update({
			accessKeyId: stage.aws.accessKey,
			secretAccessKey: stage.aws.secretKey,
			region: stage.aws.bucketRegion
		});

		if (type !== "image")
			return res
				.status(500)
				.json({ title: "Invalid Type", message: "Invalid File Type", type: "danger" });

		const s3 = new AWS.S3();
		const fileContent = Buffer.from(req.files.file.data, "binary");

		const ext = path.extname(req.files.file.name);

		const params = {
			Bucket: stage.aws.bucketName,
			Key: `${type}/${uuid.v4()}${ext}`,
			Body: fileContent,
			ACL: 'public-read'
		};

		s3.upload(params, (err, data) => {
			if (err) throw new Error(err);
			return res.status(200).json({
				title: "File Uploaded",
				message: "File uploaded successfully",
				type: "success",
				file: {
					name: data.key,
					url: data.Location
				},
				data
			});
		});
	} catch (err) {
		next(err);
	}
};
