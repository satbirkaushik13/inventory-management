import React from "react";
import "./Dashboard.css";

const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Items", path: "/items" },
    { label: "Brands", path: "/brands" },
    { label: "Categories", path: "/categories" },
    { label: "Keywords", path: "/keywords" },
];

function Dashboard({ onLogout }) {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <img src="/vite.svg" alt="Logo" />
                    <span>Inventory Tub</span>
                </div>
                <nav className="sidebar-nav">
                    {sidebarLinks.map((link) => (
                        <a key={link.path} href={link.path} className="sidebar-link">
                            {link.label}
                        </a>
                    ))}
                </nav>
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </aside>
            <main className="dashboard-viewport">
                <h2>Dashboard Viewport</h2>
                <p>Select a link from the sidebar to view API data.</p>
            </main>
        </div>
    );
}

export default Dashboard;
