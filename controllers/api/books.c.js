const bookModel = require("../../models/book.m");
const { apiError } = require("../../util/errorHandler");

exports.getBooks = async (req, res) => {
  try {
    const books = await bookModel.find({}).lean();
    return res.status(200).json({ books });
  } catch (error) {
    apiError(res, error);
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const books = await bookModel.find({ _id: recordId }).lean();
    return res.status(200).json({ books });
  } catch (error) {
    apiError(res, error);
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, thumbnail_url, date_created } = req.body;

    const newBook = await new bookModel({
      title,
      thumbnail_url,
      date_created,
    });
    await newBook.save();
    return res.status(200).json({ newBook });
  } catch (error) {
    apiError(res, error);
  }
};

exports.deleteBookById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const deleteRes = await bookModel.deleteOne({ _id: recordId });
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
