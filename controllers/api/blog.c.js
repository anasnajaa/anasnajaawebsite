const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];
const blogModel = require("../../models/blog.m");

exports.getPosts = async (req, res, next) => {
	try {
		const { limit, page, tag } = req.query;

		const posts = await blogModel.getPosts(limit, page, tag);

		return res.status(200).json(posts);
	} catch (err) {
		next(err);
	}
};

exports.getAllPosts = async (req, res, next) => {
	try {
		const posts = await blogModel.getAllPosts();

		if (posts) return res.status(200).json(posts);
		throw new Error("Not_Found");
	} catch (err) {
		next(err);
	}
};

exports.getPostBySlug = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const post = await blogModel.getPostBySlug(slug);
		if (post) return res.status(200).json({ post });
		throw new Error("Not_Found");
	} catch (err) {
		next(err);
	}
};

exports.getBlogSettings = async (req, res, next) => {
	try {
		const settings = await blogModel.getBlogSettings();

		if (settings) return res.status(200).json(settings);
		throw new Error("General_Error");
	} catch (err) {
		next(err);
	}
};

exports.getTags = async (req, res, next) => {
	try {
		const tags = await blogModel.getTags();
		return res.status(200).json(tags);
	} catch (err) {
		next(err);
	}
};

exports.getPagesByInternalTag = async (req, res, next) => {
	try {
		const { tag } = req.params;
		const pages = await blogModel.getPagesByInternalTag(tag);
		if (pages) return res.status(200).json(pages);
		return res.status(200).json({ pages: [] });
	} catch (err) {
		next(err);
	}
};

exports.getPageBySlug = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const page = await blogModel.getPageBySlug(slug);
		if (page) return res.status(200).json({ page });
		throw new Error("Not_Found");
	} catch (err) {
		next(err);
	}
};
