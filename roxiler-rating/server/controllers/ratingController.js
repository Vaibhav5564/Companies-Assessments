
const pool = require("../config/db");

const submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;

        if (
            !Number.isInteger(Number(storeId)) ||
            Number(storeId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid store ID"
            });
        }

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const store = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [Number(storeId)]
        );

        if (store.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, store_id)
             DO UPDATE SET
                rating = EXCLUDED.rating,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [req.user.id, Number(storeId), rating]
        );

        res.json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });
    } catch (error) {
        console.error("Rating error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { submitRating };
