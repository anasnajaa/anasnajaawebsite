const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		title: { type: String, required: true },
		type: { type: String, required: true },
		date: { type: Date, required: true },
		url: { type: String, required: false },
		img: { type: String, required: false },
		thumb: { type: String, required: false },
		tags: { type: Array, required: false },
		content: { type: String, required: false },
	},
	{ timestamps: false, collection: "library" }
);

module.exports = mongoose.model("library", schema);
