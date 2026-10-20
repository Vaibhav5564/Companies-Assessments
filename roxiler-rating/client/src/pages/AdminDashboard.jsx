
import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../components/DataTable";

function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: ""
    });
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user"
    });
    const [newStore, setNewStore] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setError("");

            const [dashboard, userList, storeList] = await Promise.all([
                api.get("/admin/dashboard"),
                api.get("/admin/users", { params: filters }),
                api.get("/admin/stores")
            ]);

            setStats(dashboard.data);
            setUsers(userList.data);
            setStores(storeList.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load administrator data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filters]);

    const createUser = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (
            newUser.name.trim().length < 20 ||
            newUser.name.trim().length > 60
        ) {
            setError("Name must contain 20-60 characters.");
            return;
        }

        if (
            newUser.password.length < 8 ||
            newUser.password.length > 16 ||
            !/[A-Z]/.test(newUser.password) ||
            !/[^A-Za-z0-9]/.test(newUser.password)
        ) {
            setError(
                "Password must be 8-16 characters with an uppercase letter and special character."
            );
            return;
        }

        try {
            await api.post("/admin/users", {
                ...newUser,
                name: newUser.name.trim(),
                email: newUser.email.trim().toLowerCase()
            });

            setMessage("User created successfully.");
            setNewUser({
                name: "",
                email: "",
                address: "",
                password: "",
                role: "user"
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create user."
            );
        }
    };

    const createStore = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await api.post("/admin/stores", {
                ...newStore,
                email: newStore.email.trim().toLowerCase(),
                ownerId: newStore.ownerId
                    ? Number(newStore.ownerId)
                    : null
            });

            setMessage("Store created successfully.");
            setNewStore({
                name: "",
                email: "",
                address: "",
                ownerId: ""
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create store."
            );
        }
    };

    if (loading) {
        return <main className="dashboard"><p>Loading administrator dashboard...</p></main>;
    }

    return (
        <main className="dashboard">
            <h1>Administrator Dashboard</h1>

            <div className="stats">
                <div>Total Users: {stats.total_users ?? 0}</div>
                <div>Total Stores: {stats.total_stores ?? 0}</div>
                <div>Total Ratings: {stats.total_ratings ?? 0}</div>
            </div>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <h2>Create User</h2>

            <form onSubmit={createUser}>
                <input
                    placeholder="Full name (20-60 characters)"
                    minLength={20}
                    maxLength={60}
                    value={newUser.name}
                    onChange={(e) => setNewUser({
                        ...newUser,
                        name: e.target.value
                    })}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({
                        ...newUser,
                        email: e.target.value
                    })}
                    required
                />

                <input
                    placeholder="Address"
                    maxLength={400}
                    value={newUser.address}
                    onChange={(e) => setNewUser({
                        ...newUser,
                        address: e.target.value
                    })}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (8-16 characters)"
                    minLength={8}
                    maxLength={16}
                    value={newUser.password}
                    onChange={(e) => setNewUser({
                        ...newUser,
                        password: e.target.value
                    })}
                    required
                />

                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({
                        ...newUser,
                        role: e.target.value
                    })}
                >
                    <option value="user">Normal User</option>
                    <option value="admin">Administrator</option>
                    <option value="store_owner">Store Owner</option>
                </select>

                <button type="submit">Create User</button>
            </form>

            <h2>Create Store</h2>

            <form onSubmit={createStore}>
                <input
                    placeholder="Store name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({
                        ...newStore,
                        name: e.target.value
                    })}
                    required
                />

                <input
                    type="email"
                    placeholder="Store email"
                    value={newStore.email}
                    onChange={(e) => setNewStore({
                        ...newStore,
                        email: e.target.value
                    })}
                    required
                />

                <input
                    placeholder="Store address"
                    maxLength={400}
                    value={newStore.address}
                    onChange={(e) => setNewStore({
                        ...newStore,
                        address: e.target.value
                    })}
                    required
                />

                <select
                    value={newStore.ownerId}
                    onChange={(e) => setNewStore({
                        ...newStore,
                        ownerId: e.target.value
                    })}
                >
                    <option value="">No owner assigned</option>
                    {users
                        .filter((user) => user.role === "store_owner")
                        .map((owner) => (
                            <option key={owner.id} value={owner.id}>
                                {owner.name}
                            </option>
                        ))}
                </select>

                <button type="submit">Create Store</button>
            </form>

            <h2>Users</h2>

            <div className="filters">
                {Object.keys(filters).map((key) => (
                    <input
                        key={key}
                        placeholder={`Filter by ${key}`}
                        value={filters[key]}
                        onChange={(e) => setFilters({
                            ...filters,
                            [key]: e.target.value
                        })}
                    />
                ))}
            </div>

            <DataTable
                columns={[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "address", label: "Address" },
                    { key: "role", label: "Role" }
                ]}
                data={users}
            />

            <h2>Stores</h2>

            <DataTable
                columns={[
                    { key: "name", label: "Store Name" },
                    { key: "email", label: "Email" },
                    { key: "address", label: "Address" },
                    { key: "rating", label: "Average Rating" }
                ]}
                data={stores}
            />
        </main>
    );
}

export default AdminDashboard;
