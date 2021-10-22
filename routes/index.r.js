const express = require("express");

const smsController = require("../controllers/sms.c");
const booksController = require("../controllers/books.c");
const linksController = require("../controllers/links.c");

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

// // Other
router.get("/books", booksController.getBooks);
router.get("/books/:recordId", booksController.getBookById);
//router.delete("/books/:recordId", booksController.deleteBook);
//router.post("/books", booksController.addBook);

router.get("/links", linksController.getLinks);
router.get("/links/:recordId", linksController.getLinkById);
//router.delete("/links/:recordId", linksController.deleteLinkById);
//router.post("/links", linksController.addLink);

// // Util
router.get("/awake", require("../controllers/awake"));
// router.get("/captcha", require("../controllers/captcha"));
router.get("/email/test", require("../controllers/emailTest"));

router.post("/hooks/sms/update", smsController.updateMessageStatus);
router.get("/sms/test", smsController.sendTestMessage);

module.exports = router;
