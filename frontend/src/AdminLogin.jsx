import React, { useState } from "react";
import "./AdminLogin.css";
import Dashboard from "./Dashboard";
import { adminLogin } from "./api";

function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const data = await adminLogin({ email, password });
            if (data.status === 1 && data.statusCode === 200 && data.token) {
                localStorage.setItem("token", data.token);
                onLogin();
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-login-header">
                <img src="/vite.svg" alt="Inventory Tub Logo" className="logo" />
                <h1>Welcome to the Inventory Tub</h1>
            </div>
            <div className="admin-login-container">
                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <h2>Admin Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default AdminLogin;
