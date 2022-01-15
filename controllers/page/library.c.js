const libraryModel = require("../../models/library.m");

const moment = require("moment");

libTagsCssResolver = (tag) => {
	switch (tag) {
		case "education":
			return "lib-green-dark";
		case "business":
			return "lib-blue-dark";
		case "programming":
			return "lib-purple-dark";
		case "react":
			return "lib-blue-light";
		case "memories":
			return "lib-gray-dark";
		case "leisure":
			return "lib-pink-dark";
		default:
			return "";
	}
};

exports.libraryPage = async (req, res, next) => {
	try {
		let { p, l, t, tg } = req.query;
		const { tag } = req.params;
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

		const types = await libraryModel.distinct("type").lean();
		const tags = await libraryModel.distinct("tags").lean();
		const count = await libraryModel.find(search).count();
		const items = await libraryModel
			.find(search)
			.sort({ _id: -1 })
			.limit(l)
			.skip((p - 1) * l)
			.lean();

		if (items !== undefined && items !== null && items.length > 0) {
			for (i = 0; i < items.length; i++) {
				const item = items[i];
				const publishDate = new moment(item.date);
				item.dateFriendly = publishDate.format("DD/MM/YYYY HH:mm A");
				item.dTags = [];
				item.tags.forEach((tag) => {
					item.dTags.push({
						title: tag,
						color: libTagsCssResolver(tag)
					});
				});
			}
		}

		res.render("pages/library", {
			pd: {
				items,
				types,
				tags,
				selectedType: t,
				selectedTag: tg,
				pagination: {
					total: count,
					page: p,
					pages: Math.ceil(count / l),
					url: `/library?t=${t}&tg=${tg}&l=${l}`
				},
				user: req.user
			}
		});
	} catch (err) {
		next(err);
	}
};
