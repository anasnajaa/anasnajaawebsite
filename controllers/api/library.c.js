const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];

const libraryModel = require("../../models/library.m");

exports.getLibraryItems = async (req, res, next) => {
	try {
		let { p, l, t, tg, o, st, su } = req.query;
		let search = {};

		p = p || 1; // page
		l = l || 20; // limit
		t = t || ""; // type
		tg = tg || ""; // tag
		o = o || "added-desc"; // order
		st = st || ""; // search title
		su = su || ""; // search url

		p = parseInt(p);
		l = parseInt(l);

		if (l === 0 || l === NaN) l = 20;
		if (p === 0 || p === NaN) p = 1;
		if (t) search.type = t;
		if (tg) search.tags = { $all: [tg] };
		if (st) search.title = {$regex: st, $options: "ig"};
		if (su) search.url = {$regex: su, $options: "ig"};

		if(o === "date-asc") o = { date: 1 };
		else if(o === "date-desc")  o = { date: -1 };
		else if(o === "title-asc")  o = { title: 1 };
		else if(o === "title-desc") o = { title: -1 };
		else if(o === "type-asc")   o = { type: 1 };
		else if(o === "type-desc")  o = { type: -1 };
		else if(o === "added-asc")  o = { _id: 1 };
		else if(o === "added-desc") o = { _id: -1 };
		
		const count = await libraryModel.find(search).count();
		const items = await libraryModel
			.find(search)
			.sort(o)
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
		item.dTags = [];
		item.tags?.forEach((tag) => {
			item.dTags.push({
				title: tag,
				color: libTagsCssResolver(tag)
			});
		});
		return res.status(200).json({ item });
	} catch (err) {
		next(err);
	}
};

exports.addLibItem = async (req, res, next) => {
	try {
		const { title, url, type, tags, thumb, img, content, date } = req.body;

		const newItem = await new libraryModel({
			title,
			url,
			type,
			tags,
			thumb,
			img,
			content,
			date
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
