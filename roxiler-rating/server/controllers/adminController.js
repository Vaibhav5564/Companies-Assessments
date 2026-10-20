
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const validateName = (name) =>
    typeof name === "string" &&
    name.trim().length >= 20 &&
    name.trim().length <= 60;

const validateEmail = (email) =>
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateAddress = (address) =>
    typeof address === "string" &&
    address.length <= 400;

const validatePassword = (password) =>
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 16 &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

const getDashboard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM stores) AS total_stores,
                (SELECT COUNT(*) FROM ratings) AS total_ratings
        `);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const {
            name = "",
            email = "",
            address = "",
            role = ""
        } = req.query;

        const result = await pool.query(
            `SELECT id, name, email, address, role
             FROM users
             WHERE name ILIKE $1
               AND email ILIKE $2
               AND address ILIKE $3
               AND role ILIKE $4
             ORDER BY name ASC`,
            [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const createUser = async (req, res) => {
    try {
        let { name, email, address, password, role } = req.body;

        if (
            !validateName(name) ||
            !validateEmail(email) ||
            !validateAddress(address) ||
            !validatePassword(password) ||
            !["admin", "user", "store_owner"].includes(role)
        ) {
            return res.status(400).json({
                message: "Invalid user details. Check name, email, address, password and role."
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();

        const existing = await pool.query(
            "SELECT id FROM users WHERE LOWER(email) = $1",
            [email]
        );

        if (existing.rows.length) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, address, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, address, role`,
            [name, email, address, hashedPassword, role]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error.message);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const getStores = async (req, res) => {
    try {
        const { name = "", email = "", address = "" } = req.query;

        const result = await pool.query(
            `SELECT s.id, s.name, s.email, s.address,
                    COALESCE(AVG(r.rating), 0) AS rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.name ILIKE $1
               AND s.email ILIKE $2
               AND s.address ILIKE $3
             GROUP BY s.id
             ORDER BY s.name ASC`,
            [`%${name}%`, `%${email}%`, `%${address}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const createStore = async (req, res) => {
    try {
        let { name, email, address, ownerId } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !validateEmail(email) ||
            !validateAddress(address)
        ) {
            return res.status(400).json({
                message: "Invalid store details"
            });
        }

        if (
            ownerId != null &&
            (!Number.isInteger(Number(ownerId)) || Number(ownerId) <= 0)
        ) {
            return res.status(400).json({
                message: "Invalid store owner ID"
            });
        }

        if (ownerId != null) {
            const owner = await pool.query(
                "SELECT id FROM users WHERE id = $1 AND role = 'store_owner'",
                [Number(ownerId)]
            );

            if (!owner.rows.length) {
                return res.status(400).json({
                    message: "Invalid store owner"
                });
            }
        }

        const result = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                address,
                ownerId == null ? null : Number(ownerId)
            ]
        );

        res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0]
        });
    } catch (error) {
        console.error("Create store error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    createUser,
    getStores,
    createStore
};
