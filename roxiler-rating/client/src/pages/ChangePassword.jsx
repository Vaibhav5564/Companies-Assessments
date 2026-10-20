
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (
            newPassword.length < 8 ||
            newPassword.length > 16 ||
            !/[A-Z]/.test(newPassword) ||
            !/[^A-Za-z0-9]/.test(newPassword)
        ) {
            setError(
                "Password must be 8-16 characters with an uppercase letter and special character."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await api.put("/auth/change-password", {
                currentPassword,
                newPassword
            });

            setMessage(response.data.message);
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Change Password</h2>

                <label htmlFor="currentPassword">Current Password</label>
                <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />

                <label htmlFor="newPassword">New Password</label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    maxLength={16}
                    required
                />

                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
