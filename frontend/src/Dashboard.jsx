import React, { useState } from "react";
import "./Dashboard.css";
import ItemsTable from "./ItemsTable";
import BrandsTable from "./BrandsTable";
import CategoriesTable from "./CategoriesTable";
import KeywordsTable from "./KeywordsTable";

const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Items", path: "/items" },
    { label: "Brands", path: "/brands" },
    { label: "Categories", path: "/categories" },
    { label: "Keywords", path: "/keywords" },
];

function Dashboard({ onLogout }) {
    const [tab, setTab] = useState("items");

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <img src="/vite.svg" alt="Logo" />
                    <span>Inventory Tub</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={tab === "items" ? "active" : ""} onClick={() => setTab("items")}>
                        Items
                    </button>
                    <button className={tab === "brands" ? "active" : ""} onClick={() => setTab("brands")}>
                        Brands
                    </button>
                    <button className={tab === "categories" ? "active" : ""} onClick={() => setTab("categories")}>
                        Categories
                    </button>
                    <button className={tab === "keywords" ? "active" : ""} onClick={() => setTab("keywords")}>
                        Keywords
                    </button>
                </nav>
                <div style={{ width: "100%", marginTop: "auto" }}>
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="dashboard-viewport">
                {tab === "items" && <ItemsTable />}
                {tab === "brands" && <BrandsTable />}
                {tab === "categories" && <CategoriesTable />}
                {tab === "keywords" && <KeywordsTable />}
            </main>
        </div>
    );
}

export default Dashboard;
