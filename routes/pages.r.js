const express = require("express");
const blogController = require("../controllers/page/blog.c");
const libraryController = require("../controllers/page/library.c");
const servicesController = require("../controllers/page/service.c");
const adminController = require("../controllers/page/admin.c");

const { isLoggedIn, isLoggedOut, isAdmin, userIfExist } = require("../middleware/hasAuth");

const router = express.Router();

router.get("/", userIfExist, (req, res) => {
	res.render("pages/index", { pd: { user: req.user } });
});

router.get("/library", userIfExist, libraryController.libraryPage);

router.get("/services", userIfExist, servicesController.servicePage);
router.get("/services/request", userIfExist, servicesController.serviceRequestForm);
router.get("/services/faq", userIfExist, servicesController.serviceFaq);
router.get("/services/verify-request", userIfExist, servicesController.serviceVerify);

router.get("/blog", userIfExist, blogController.blogPosts);
router.get("/blog/topics/:tag", userIfExist, blogController.blogPosts);
router.get("/blog/topics", userIfExist, blogController.blogTopics);
router.get("/blog/archive", userIfExist, blogController.blogArchive);
router.get("/blog/:slug", userIfExist, blogController.postPage);

// Admin
router.get("/login", isLoggedOut, adminController.login);
router.get("/admin", isLoggedIn, adminController.dashboard);
router.get("/admin/profile", isLoggedIn, adminController.profile);
router.get("/admin/logout", isLoggedIn, adminController.logout);

router.get("/admin/library", isAdmin, adminController.library);
router.get("/admin/library/view", isAdmin, adminController.libraryView);
router.get("/admin/library/edit", isAdmin, adminController.libraryEdit);
router.get("/admin/library/add", isAdmin, adminController.libraryAdd);
router.get("/admin/library/delete", isAdmin, adminController.libraryDelete);

module.exports = router;
