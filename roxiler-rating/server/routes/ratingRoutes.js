
const express = require("express");
const router = express.Router();

const {
    submitRating
} = require("../controllers/ratingController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth");

router.post(
    "/",
    authenticateToken,
    authorizeRoles("user"),
    submitRating
);

module.exports = router;
