
const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getUsers,
    createUser,
    getStores,
    createStore
} = require("../controllers/adminController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth");

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.post("/users", createUser);
router.get("/stores", getStores);
router.post("/stores", createStore);

module.exports = router;
