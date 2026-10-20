
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    validateEmail,
    validatePassword
} = require("../middleware/validate");

const register = async (req, res) => {
    try {
        let { name, email, address, password } = req.body;

        if (
            typeof name !== "string" ||
            name.trim().length < 20 ||
            name.trim().length > 60 ||
            !validateEmail(email) ||
            typeof address !== "string" ||
            address.length > 400 ||
            !validatePassword(password)
        ) {
            return res.status(400).json({
                message: "Invalid registration details"
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();

        const existing = await pool.query(
            "SELECT id FROM users WHERE LOWER(email) = $1",
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, address, password, role)
             VALUES ($1, $2, $3, $4, 'user')
             RETURNING id, name, email, address, role`,
            [name, email, address, hashedPassword]
        );

        res.status(201).json({
            message: "Registration successful",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT id, name, email, address, role, password FROM users WHERE LOWER(email) = $1",
            [email.trim().toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (
            typeof currentPassword !== "string" ||
            typeof newPassword !== "string"
        ) {
            return res.status(400).json({
                message: "Current and new passwords are required"
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters with an uppercase letter and special character"
            });
        }

        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const validPassword = await bcrypt.compare(
            currentPassword,
            result.rows[0].password
        );

        if (!validPassword) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, req.user.id]
        );

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Password change error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    login,
    changePassword
};
