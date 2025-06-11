// src/api.js

const API_BASE_URL = "http://localhost:5050";

export async function adminLogin({ email, password }) {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

// Add more API functions as needed, e.g.:
// export async function getItems(token) { ... }
