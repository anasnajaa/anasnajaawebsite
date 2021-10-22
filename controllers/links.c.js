const linkModel = require("../models/link.m");
const { apiError } = require("../util/errorHandler");

exports.getLinks = async (req, res) => {
  try {
    const links = await linkModel.find({}).lean();
    res.status(200).json({ links });
  } catch (error) {
    apiError(res, error);
  }
};

exports.getLinkById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const books = await linkModel.find({ _id: recordId }).lean();
    return res.status(200).json({ books });
  } catch (error) {
    apiError(res, error);
  }
};

exports.addLink = async (req, res) => {
  try {
    const { title, url, likes, tags, date_created } = req.body;

    const newLink = await new linkModel({
      title,
      url,
      likes,
      tags,
      date_created,
    });
    await newLink.save();
    res.status(200).json({ newLink });
  } catch (error) {
    apiError(res, error);
  }
};

exports.deleteLinkById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const deleteRes = await linkModel.deleteOne({ _id: recordId });
    if (deleteRes.deletedCount === 1) {
      return res.status(200).json(deleteRes);
    }

    return res.status(400).json({
      title: "Error",
      message: "Failed to delete record",
      type: "danger",
    });
  } catch (error) {
    apiError(res, error);
  }
};
