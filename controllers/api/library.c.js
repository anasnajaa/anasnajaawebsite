const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];

const libraryModel = require("../../models/library.m");

exports.getLibraryItems = async (req, res, next) => {
	try {
		let { p, l, t, tg } = req.query;
		let search = {};

		p = p || 1;
		l = l || 20;
		t = t || "";
		tg = tg || "";

		p = parseInt(p);
		l = parseInt(l);

		if (l === 0 || l === NaN) l = 20;
		if (p === 0 || p === NaN) p = 1;
		if (t) search.type = t;
		if (tg) search.tags = { $all: [tg] };

		const count = await libraryModel.find(search).count();
		const items = await libraryModel
			.find(search)
			.sort({ date: 1 })
			.limit(l)
			.skip((p - 1) * l)
			.lean();

		if (items !== undefined && items !== null && items.length > 0) {
			for (i = 0; i < items.length; i++) {
				const item = items[i];
				item.dTags = [];
				item.tags.forEach((tag) => {
					item.dTags.push({
						title: tag,
						color: libTagsCssResolver(tag)
					});
				});
			}
		}

		return res.status(200).json({
			count,
			records: items
		});
	} catch (err) {
		next(err);
	}
};

exports.getTags = async (req, res, next) => {
	try {
		const tags = await libraryModel.distinct("tags").lean();
		return res.status(200).json({ tags });
	} catch (err) {
		next(err);
	}
};

exports.getTypes = async (req, res, next) => {
	const types = await libraryModel.distinct("type").lean();
	return res.status(200).json({ types });
};

exports.getLibItemById = async (req, res, next) => {
	try {
		const { recordId } = req.params;
		let item = await libraryModel.find({ _id: recordId }).lean();
		if (item.length > 0) {
			item = item[0];
		}
		return res.status(200).json({ item });
	} catch (err) {
		next(err);
	}
};

exports.addLibItem = async (req, res, next) => {
	try {
		const { title, url, type, tags, thumb } = req.body;

		const newItem = await new libraryModel({
			title,
			url,
			type,
			tags,
			thumb
		});
		await newItem.save();
		return res.status(200).json({ item: newItem });
	} catch (err) {
		next(err);
	}
};

exports.deleteLibItemById = async (req, res, next) => {
	try {
		const { recordId } = req.params;
		const deleteRes = await libraryModel.deleteOne({ _id: recordId });
		if (deleteRes.deletedCount === 1) {
			return res.status(200).json(deleteRes);
		}

		return res.status(400).json({
			title: "Error",
			message: "Failed to delete record",
			type: "danger"
		});
	} catch (err) {
		next(err);
	}
};
