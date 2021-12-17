const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		roles: { type: Array, required: true },
		isActive: { type: Boolean, required: true }
	},
	{ timestamps: false, collection: "users" }
);

module.exports = mongoose.model("users", schema);
