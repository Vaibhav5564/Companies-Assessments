
const express = require("express");
const router = express.Router();

const {
    getDashboard
} = require("../controllers/ownerController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth");

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("store_owner"),
    getDashboard
);

module.exports = router;
