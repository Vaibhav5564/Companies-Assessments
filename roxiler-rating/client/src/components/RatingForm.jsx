
import { useState } from "react";
import api from "../services/api";

function RatingForm({ store, onClose, onSuccess }) {
    const [rating, setRating] = useState(
        store.user_rating ?? 5
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/ratings", {
                storeId: store.id,
                rating: Number(rating)
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to submit rating"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rating-form">
            <h3>Rate {store.name}</h3>

            <label htmlFor="rating">Rating (1–5)</label>

            <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
            >
                {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                        {value} Star{value > 1 ? "s" : ""}
                    </option>
                ))}
            </select>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Submit Rating"}
            </button>

            <button type="button" onClick={onClose}>
                Cancel
            </button>
        </form>
    );
}

export default RatingForm;
