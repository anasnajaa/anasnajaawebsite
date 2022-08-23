const express = require("express");

const smsController = require("../controllers/api/sms.c");
const blogController = require("../controllers/api/blog.c");
const emailController = require("../controllers/api/email.c");
const otherController = require("../controllers/api/other.c");
const serviceController = require("../controllers/api/service.c");
const filesController = require("../controllers/api/files.c");
const libraryController = require("../controllers/api/library.c");
const taskController = require("../controllers/api/task.c");
const authController = require("../controllers/api/auth.c");

const { isAdmin, isLoggedIn, isLoggedOut } = require("../middleware/hasAuth");

const router = express.Router();

// Customer Service
// router.post(
//   "/request/service/send-verification-code",
//   require("../controllers/customer_service/sendVerificationCode.c")
// );
// router.post(
//   "/request/service/verify",
//   require("../controllers/customer_service/verifyAuthCode.c")
// );
// router.post(
//   "/request/service/complete-profile",
//   require("../controllers/customer_service/completeProfile.c")
// );

// Blog
router.get("/blog/posts/tag/:tag", blogController.getPosts);
router.get("/blog/posts/slug/:slug", blogController.getPostBySlug);
router.get("/blog/posts/archive", blogController.getAllPosts);
router.get("/blog/pages/tag/:tag", blogController.getPagesByInternalTag);
router.get("/blog/pages/slug/:slug", blogController.getPageBySlug);
router.get("/blog/settings", blogController.getBlogSettings);
router.get("/blog/tags", blogController.getTags);

// Library
router.get("/library", libraryController.getLibraryItems);
router.post("/library", isAdmin, libraryController.addLibItem);
router.get("/library/tags", libraryController.getTags);
router.get("/library/types", libraryController.getTypes);
router.get("/library/:recordId", libraryController.getLibItemById);
router.delete("/library/:recordId", isAdmin, libraryController.deleteLibItemById);

// Task
router.get("/task", isAdmin,taskController.getItems);
router.post("/task", isAdmin, taskController.addItem);
router.get("/task/category", isAdmin, taskController.getCategories);
router.get("/task/:recordId", isAdmin, taskController.getItemById);
router.delete("/task/:recordId", isAdmin, taskController.deleteItemById);
router.put("/task/:recordId", isAdmin, taskController.updateItemById);
router.put("/task/:recordId/toggle", isAdmin, taskController.toggleCompleteStatus);
router.delete("/task/:recordId", isAdmin, taskController.deleteItemById);

// SMS
router.post("/hooks/sms/update", smsController.updateMessageStatus);
router.get("/sms/test", isAdmin, smsController.sendTestMessage);
router.get("/sms", isAdmin, smsController.getMessages);

// Email
router.get("/email/test", isAdmin, emailController.testEmail);

// Other
router.get("/awake", otherController.awake);
// router.get("/captcha", require("../controllers/captcha"));

// Service
router.post("/service", serviceController.newServiceRequest);
router.post("/service/:requestId/verify", serviceController.verifyServiceOtp);

// Files
router.post("/admin/files/upload", isAdmin, filesController.uploadFile);

// Auth
router.post("/auth/login", isLoggedOut, authController.login);
router.post("/auth/logout", isLoggedIn, authController.logout);

module.exports = router;
