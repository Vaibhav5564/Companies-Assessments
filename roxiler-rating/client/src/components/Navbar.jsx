
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                Roxiler Rating
            </Link>

            {user && (
                <div className="nav-links">
                    <span>{user.name}</span>
                    <span>{user.role}</span>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
