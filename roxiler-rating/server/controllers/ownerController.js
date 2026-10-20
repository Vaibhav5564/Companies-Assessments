
const pool = require("../config/db");

const getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const storeResult = await pool.query(
            `SELECT
                s.id,
                s.name,
                ROUND(COALESCE(AVG(r.rating), 0)::numeric, 2) AS average_rating,
                COUNT(r.id) AS total_ratings
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.owner_id = $1
             GROUP BY s.id
             ORDER BY s.name ASC`,
            [ownerId]
        );

        const ratingsResult = await pool.query(
            `SELECT
                s.name AS store_name,
                u.name,
                u.email,
                r.rating,
                r.updated_at
             FROM ratings r
             JOIN users u ON r.user_id = u.id
             JOIN stores s ON r.store_id = s.id
             WHERE s.owner_id = $1
             ORDER BY r.updated_at DESC`,
            [ownerId]
        );

        res.json({
            stores: storeResult.rows,
            ratings: ratingsResult.rows
        });
    } catch (error) {
        console.error("Owner dashboard error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getDashboard };
