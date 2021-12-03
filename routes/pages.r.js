const express = require("express");
const blogController = require("../controllers/page/blog.c");
const pagesController = require("../controllers/page/pages.c");
const servicesController = require("../controllers/page/service.c");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/index");
});

router.get("/library", pagesController.libraryPage);

router.get("/services", pagesController.servicePage);
router.get("/services/request", servicesController.serviceRequestForm);
router.get("/services/faq", servicesController.serviceFaq);
router.get("/services/verify-request", servicesController.serviceVerify);

router.get("/blog", blogController.blogPosts);
router.get("/blog/topics/:tag", blogController.blogPosts);
router.get("/blog/topics", blogController.blogTopics);
router.get("/blog/archive", blogController.blogArchive);
router.get("/blog/:slug", blogController.postPage);

module.exports = router;
