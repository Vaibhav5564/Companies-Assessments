
const express = require("express");
const router = express.Router();

const { getStores } = require("../controllers/storeController");
const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth");

router.get(
    "/",
    authenticateToken,
    authorizeRoles("user"),
    getStores
);

module.exports = router;
