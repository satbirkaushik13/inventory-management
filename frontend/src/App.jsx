import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
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
