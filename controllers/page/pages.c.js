const blogModel = require("../../models/blog.m");
const libraryModel = require("../../models/library.m");

const moment = require("moment");

exports.servicePage = async (req, res) => {
	const response = await blogModel.getPagesByInternalTag("services-page");
	const headerSectionId = "5f9040ca5d24f1001e75ee71";
	const teachingProgramming = "5f904a755d24f1001e75eeb5";
	const developmentProject = "5f904b025d24f1001e75eec3";
	const generalIt = "5f904bd15d24f1001e75eeed";

	const headerCard = response.pages.find((x) => x.id === headerSectionId);
	const services = response.pages.filter((x) => {
		return x.id === teachingProgramming || x.id === developmentProject || x.id === generalIt;
	});

	return res.render("pages/services", { pd: { headerCard, services } });
};

libTagsCssResolver = (tag) => {
  switch(tag){
    case "education":   return "lib-green-dark";
    case "business":    return "lib-blue-dark";
    case "programming": return "lib-purple-dark";
    case "react":       return "lib-blue-light";
    case "memories":    return "lib-gray-dark";
    case "leisure":     return "lib-pink-dark";
    default:            return "";
  }
};

exports.libraryPage = async (req, res) => {
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
	if (tg) search.tags = { $all: [tg]};

	const types = await libraryModel.distinct("type").lean();
	const tags = await libraryModel.distinct("tags").lean();
	const count = await libraryModel.find(search).count();
	const items = await libraryModel
		.find(search)
		.sort({date: 1})
		.limit(l)
		.skip((p - 1) * l)
		.lean();

	if(items !== undefined &&
	   items !== null &&
	   items.length > 0) {
		for(i=0; i<items.length; i++){
			const item = items[i];
			item.dTags = [];
			item.tags.forEach(tag => {
				item.dTags.push({
					title: tag,
					color: libTagsCssResolver(tag)
				})
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
			}
		}
	});
};
