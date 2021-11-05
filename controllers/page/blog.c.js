const blogModel = require("../../models/blog.m");
const moment = require("moment");

exports.blogPosts = async (req, res) => {
  let { p, l } = req.query;
  const { tag } = req.params;

  p = p || 1;
  l = l || 4;

  const response = await blogModel.getPosts(l, p, tag);

  if (
    response.posts !== undefined &&
    response.posts !== null &&
    response.posts.length > 0
  ) {
    response.posts.forEach((post) => {
      const publishDate = new moment(post.published_at);

      post.published_at_friendly = publishDate.fromNow();
      post.published_at_formated = publishDate.format("DD/MM/YYYY HH:mm A");

      if (
        post.tags !== undefined &&
        post.tags !== null &&
        post.tags.length > 0
      ) {
        post.tags.forEach((tag) => {
          tag.css = blogModel.tagsCssResolver(tag.id);
        });
      }
    });
  }

  res.render("pages/blog", {
    posts: response.posts,
    pagination: response.meta.pagination,
    page: p,
    tag,
  });
};

exports.blogArchive = async (req, res) => {
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

  if (
    response.posts !== undefined &&
    response.posts !== null &&
    response.posts.length > 0
  ) {
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
  res.render("pages/blog-archive", { archiveElements });
};

exports.postPage = async (req, res) => {
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
    return res.render("pages/blog-post", { post });
  }

  return res.render("pages/404");
};

exports.blogTopics = async (req, res) => {
  const response = await blogModel.getTags();
  const tags = response.tags;
  tags.forEach((tag) => {
    tag.css = blogModel.tagsCssResolver(tag.id);
  });
  return res.render("pages/blog-topics", { tags });
};
