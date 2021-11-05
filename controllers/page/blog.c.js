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
  res.render("pages/blog-archive", {});
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
