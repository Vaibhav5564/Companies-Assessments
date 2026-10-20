
import { useEffect, useState } from "react";
import api from "../services/api";
import StoreCard from "../components/StoreCard";
import RatingForm from "../components/RatingForm";

function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStore, setSelectedStore] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadStores = async () => {
        try {
            setError("");
            setLoading(true);

            const response = await api.get("/stores", {
                params: { search }
            });

            setStores(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load stores."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, [search]);

    const handleRatingSuccess = async () => {
        setSelectedStore(null);
        await loadStores();
    };

    return (
        <main className="dashboard">
            <h1>Store Ratings</h1>

            <input
                type="search"
                placeholder="Search by store name or address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Loading stores...</p>
            ) : (
                <div className="store-list">
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onRate={setSelectedStore}
                        />
                    ))}

                    {stores.length === 0 && (
                        <p>No stores found.</p>
                    )}
                </div>
            )}

            {selectedStore && (
                <RatingForm
                    store={selectedStore}
                    onClose={() => setSelectedStore(null)}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </main>
    );
}

export default UserDashboard;
