
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.name.trim().length < 20 ||
            form.name.trim().length > 60) {
            setError("Name must be between 20 and 60 characters.");
            return;
        }

        if (form.address.length > 400) {
            setError("Address must not exceed 400 characters.");
            return;
        }

        if (form.password.length < 8 ||
            form.password.length > 16 ||
            !/[A-Z]/.test(form.password) ||
            !/[^A-Za-z0-9]/.test(form.password)) {
            setError(
                "Password must be 8-16 characters with an uppercase letter and special character."
            );
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/register", form);
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                <label htmlFor="name">Full Name</label>
                <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    minLength={20}
                    maxLength={60}
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="address">Address</label>
                <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    maxLength={400}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={16}
                    required
                />

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

                <p>
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
