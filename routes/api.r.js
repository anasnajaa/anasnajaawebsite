const express = require("express");

const smsController = require("../controllers/api/sms.c");
const booksController = require("../controllers/api/books.c");
const linksController = require("../controllers/api/links.c");
const blogController = require("../controllers/api/blog.c");
const emailController = require("../controllers/api/email.c");
const otherController = require("../controllers/api/other.c");
const serviceController = require("../controllers/api/service.c");

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

// Books
router.get("/books", booksController.getBooks);
router.get("/books/:recordId", booksController.getBookById);
//router.delete("/books/:recordId", booksController.deleteBook);
//router.post("/books", booksController.addBook);

// Links
router.get("/links", linksController.getLinks);
router.get("/links/:recordId", linksController.getLinkById);
//router.delete("/links/:recordId", linksController.deleteLinkById);
//router.post("/links", linksController.addLink);

// SMS
router.post("/hooks/sms/update", smsController.updateMessageStatus);
//router.get("/sms/test", smsController.sendTestMessage);
router.get("/sms", smsController.getMessages);

// Email
router.get("/email/test", emailController.testEmail);

// Other
router.get("/awake", otherController.awake);
// router.get("/captcha", require("../controllers/captcha"));

// Service
router.post("/service", serviceController.newServiceRequest);
router.post("/service/:requestId/verify", serviceController.verifyServiceOtp);

module.exports = router;
