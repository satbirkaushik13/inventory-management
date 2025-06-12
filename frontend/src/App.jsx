import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import "./App.css";

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) return false;
        // exp is in seconds, Date.now() in ms
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !isTokenExpired(token)) {
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
        }
        // Optionally, set up interval to auto-logout on expiry
        const interval = setInterval(() => {
            const t = localStorage.getItem("token");
            if (t && isTokenExpired(t)) {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        }, 60000); // check every 60s
        return () => clearInterval(interval);
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}

export default App;
