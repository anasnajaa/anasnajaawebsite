const express = require("express");
const blogController = require("../controllers/page/blog.c");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/index");
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/services", (req, res) => {
  res.render("pages/services");
});

router.get("/posts/:slug", blogController.postPage);

module.exports = router;
