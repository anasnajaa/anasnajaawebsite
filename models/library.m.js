const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: { type: String, required: false },
    thumb: { type: String, required: true },
    date: { type: Date, required: false },
    url: { type: String, required: true },
    tags: { type: Array, required: false },
    type: { type: String, required: true },
  },
  { timestamps: false, collection: "library" }
);

module.exports = mongoose.model("library", schema);
