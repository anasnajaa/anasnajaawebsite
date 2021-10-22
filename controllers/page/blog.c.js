const blogModel = require("../../models/blog.m");

exports.postPage = async (req, res) => {
  const { slug } = req.params;

  const post = await blogModel.getPostBySlug(slug);

  if (post) return res.render("pages/blog-post", { post });
  return res.render("pages/404");
};
