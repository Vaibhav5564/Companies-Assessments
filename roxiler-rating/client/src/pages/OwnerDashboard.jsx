
import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

function OwnerDashboard() {
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await api.get("/owner/dashboard");
                setStores(response.data.stores);
                setRatings(response.data.ratings);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalRatings = stores.reduce(
        (total, store) => total + Number(store.total_ratings),
        0
    );

    return (
        <main className="dashboard">
            <h1>Store Owner Dashboard</h1>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Loading dashboard...</p>
            ) : (
                <>
                    <h2>My Stores</h2>

                    {stores.length === 0 ? (
                        <p>No stores are assigned to your account yet.</p>
                    ) : (
                        <DataTable
                            columns={[
                                { key: "name", label: "Store Name" },
                                {
                                    key: "average_rating",
                                    label: "Average Rating"
                                },
                                {
                                    key: "total_ratings",
                                    label: "Total Ratings"
                                }
                            ]}
                            data={stores}
                        />
                    )}

                    <h2>Rating Summary</h2>
                    <p>Total ratings received: {totalRatings}</p>

                    <h2>Customers Who Rated Your Stores</h2>

                    {ratings.length === 0 ? (
                        <p>No ratings received yet.</p>
                    ) : (
                        <DataTable
                            columns={[
                                {
                                    key: "store_name",
                                    label: "Store Name"
                                },
                                {
                                    key: "name",
                                    label: "Customer Name"
                                },
                                {
                                    key: "email",
                                    label: "Customer Email"
                                },
                                {
                                    key: "rating",
                                    label: "Rating"
                                },
                                {
                                    key: "updated_at",
                                    label: "Last Updated"
                                }
                            ]}
                            data={ratings}
                        />
                    )}
                </>
            )}
        </main>
    );
}

export default OwnerDashboard;
