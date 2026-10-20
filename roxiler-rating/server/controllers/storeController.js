
const pool = require("../config/db");

const getStores = async (req, res) => {
    try {
        const { search = "" } = req.query;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.address,
                ROUND(COALESCE(AVG(all_ratings.rating), 0), 2) AS overall_rating,
                my_rating.rating AS user_rating
             FROM stores s
             LEFT JOIN ratings all_ratings
                ON s.id = all_ratings.store_id
             LEFT JOIN ratings my_rating
                ON s.id = my_rating.store_id
                AND my_rating.user_id = $1
             WHERE s.name ILIKE $2
                OR s.address ILIKE $2
             GROUP BY s.id, my_rating.rating
             ORDER BY s.name ASC`,
            [userId, `%${search}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Get stores error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getStores };
