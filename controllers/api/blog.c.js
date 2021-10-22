require("dotenv").config();
const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];
const { apiError } = require("../../util/errorHandler");
const blogModel = require("../../models/blog.m");

exports.getPosts = async (req, res) => {
  try {
    const { limit, page, tag } = req.query;

    const posts = await blogModel.getPosts(limit, page, tag);

    return res.status(200).json(posts);
  } catch (error) {
    apiError(res, error);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await blogModel.getAllPosts();

    if (posts) return res.status(200).json(posts);
    return res.status(400).json({
      title: "Not Found",
      message: "Posts not found",
      type: "warning",
    });
  } catch (error) {
    apiError(res, error);
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await blogModel.getPostBySlug(slug);
    if (post) return res.status(200).json({ post });
    return res.status[404].json({
      title: "Not Found",
      message: "Post not found",
      type: "warning",
    });
  } catch (error) {
    apiError(res, error);
  }
};

exports.getBlogSettings = async (req, res) => {
  try {
    const settings = await blogModel.getBlogSettings();

    if (settings) return res.status(200).json(settings);
    return res.status(400).json({
      title: "Error",
      message: "Error retriving settings",
      type: "danger",
    });
  } catch (error) {
    apiError(res, error);
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await blogModel.getTags();
    return res.status(200).json(tags);
  } catch (error) {
    apiError(res, error);
  }
};

exports.getPagesByInternalTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const pages = await blogModel.getPagesByInternalTag(tag);
    if (pages) return res.status(200).json(pages);
    return res.status(200).json({ pages: [] });
  } catch (error) {
    apiError(res, error);
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await blogModel.getPageBySlug(slug);
    if (page) return res.status(200).json({ page });
    return res.status(404).json({
      title: "Error",
      message: "Page not found",
      type: "info",
    });
  } catch (error) {
    apiError(res, error);
  }
};
