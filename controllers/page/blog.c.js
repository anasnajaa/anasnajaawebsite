const blogModel = require("../../models/blog.m");
const moment = require("moment");

exports.blogPosts = async (req, res, next) => {
	try {
		let { p, l } = req.query;
		const { tag } = req.params;

		p = p || 1;
		l = l || 4;

		p = parseInt(p);
		l = parseInt(l);

		if (p === 0 || p === NaN) p = 1;
		if (l === 0 || l === NaN) l = 4;

		const response = await blogModel.getPosts(l, p, tag);

		if (response.posts !== undefined && response.posts !== null && response.posts.length > 0) {
			response.posts.forEach((post) => {
				const publishDate = new moment(post.published_at);

				post.published_at_friendly = publishDate.fromNow();
				post.published_at_formated = publishDate.format("DD/MM/YYYY HH:mm A");

				if (post.tags !== undefined && post.tags !== null && post.tags.length > 0) {
					post.tags.forEach((tag) => {
						tag.css = blogModel.tagsCssResolver(tag.id);
					});
				}
			});
		}
		const pagination = response.meta.pagination;

		if (tag) {
			pagination.url = `/blog/topics/${tag}?l=${l}`;
		} else {
			pagination.url = `/blog?l=${l}`;
		}

		res.render("pages/blog", {
			pd: {
				posts: response.posts,
				pagination,
				page: p,
				tag,
				user: req.user
			}
		});
	} catch (err) {
		next(err);
	}
};

exports.blogArchive = async (req, res, next) => {
	try {
		const monthYearElement = (datePublished, year, month) => {
			const elmData = datePublished.format("YYYY-MM-01T00:00:000");
			return `
        <tr data-header-date="${elmData}" class="bg-secondary">
            <td colspan="3"><strong class="text-white">${year}-${month}</strong></td>
        </tr>`;
		};

		const postElement = ({ id, datePublished, slug, title }) => {
			const elmData = datePublished.format("YYYY-MM-DDTHH:mm:sss");
			return `
        <tr data-post-date="${elmData}" data-archive-title="${title}">
            <td class="text-center">${datePublished.format("DD")}</td>
            <td>
                <a class="text-decoration-none text-dark" href="/blog/${slug}">${title}</a>
            </td>
        </tr>`;
		};

		const archiveElements = [];
		const response = await blogModel.getAllPosts();

		if (response.posts !== undefined && response.posts !== null && response.posts.length > 0) {
			const posts = response.posts;
			let currentMonth = null;
			let currentYear = null;

			posts.forEach((post) => {
				post.datePublished = new moment(post.published_at);
				const postMonth = post.datePublished.month();
				const postYear = post.datePublished.year();

				if (postMonth !== currentMonth || postYear !== currentYear) {
					currentMonth = postMonth;
					currentYear = postYear;
					archiveElements.push(
						monthYearElement(
							post.datePublished,
							currentYear,
							post.datePublished.format("MMMM")
						)
					);
				}
				archiveElements.push(postElement(post));
			});
		}
		res.render("pages/blog-archive", {
			pd: {
				archiveElements,
				user: req.user
			}
		});
	} catch (err) {
		next(err);
	}
};

exports.postPage = async (req, res, next) => {
	try {
		const { slug } = req.params;

		const post = await blogModel.getPostBySlug(slug);

		if (post) {
			const publishDate = new moment(post.published_at);

			post.published_at_friendly = publishDate.fromNow();
			post.published_at_formated = publishDate.format("DD/MM/YYYY HH:mm A");
			if (post.tags !== undefined && post.tags !== null && post.tags.length > 0) {
				post.tags.forEach((tag) => {
					tag.css = blogModel.tagsCssResolver(tag.id);
				});
			}
			return res.render("pages/blog-post", { pd: { post, user: req.user } });
		}

		throw new Error("Not_Found");
	} catch (err) {
		next(err);
	}
};

exports.blogTopics = async (req, res, next) => {
	try {
		const response = await blogModel.getTags();
		const tags = response.tags;
		tags.forEach((tag) => {
			tag.css = blogModel.tagsCssResolver(tag.id);
		});
		return res.render("pages/blog-topics", { pd: { tags, user: req.user } });
	} catch (err) {
		next(err);
	}
};
