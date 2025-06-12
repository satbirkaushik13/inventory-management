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

function getToken() {
    return localStorage.getItem("token");
}

export async function fetchItems({ page = 1, pageSize = 10 }) {
    const res = await fetch(`${API_BASE_URL}/items/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ page, pageSize }),
    });
    return res.json();
}

export async function addItem(item) {
    const res = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(item),
    });
    return res.json();
}

export async function uploadItemImage(item_id, file) {
    const formData = new FormData();
    formData.append("attachment_name", file);
    formData.append("attachment_type", 1);
    const res = await fetch(`${API_BASE_URL}/items/${item_id}/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
    });
    return res.json();
}

export async function getItem(item_id) {
    const res = await fetch(`${API_BASE_URL}/items/${item_id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
}

export async function updateItem(item_id, item) {
    const res = await fetch(`${API_BASE_URL}/items/${item_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(item),
    });
    return res.json();
}

export async function deleteItem(item_id) {
    const res = await fetch(`${API_BASE_URL}/items/${item_id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
}

export async function getItemKeywords(item_id) {
    const res = await fetch(`${API_BASE_URL}/items/${item_id}/keywords`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return res.json();
}

export async function addItemKeywords(item_id, keywords) {
    const res = await fetch(`${API_BASE_URL}/items/${item_id}/keywords`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(keywords),
    });
    return res.json();
}

export async function fetchBrands({ page = 1, pageSize = 10 }) {
    const res = await fetch(`${API_BASE_URL}/brands/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ page, pageSize }),
    });
    return res.json();
}

export async function addBrands(brands) {
    const res = await fetch(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(brands),
    });
    return res.json();
}

export async function fetchCategories({ page = 1, pageSize = 10, orderBy }) {
    const body = { page, pageSize };
    if (orderBy) body.orderBy = orderBy;
    const res = await fetch(`${API_BASE_URL}/categories/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
    });
    return res.json();
}

export async function addCategories(categories) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(categories),
    });
    return res.json();
}

export async function fetchKeywords({ page = 1, pageSize = 10, orderBy }) {
    const body = { page, pageSize };
    if (orderBy) body.orderBy = orderBy;
    const res = await fetch(`${API_BASE_URL}/keywords/all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
    });
    return res.json();
}

export async function addKeywords(keywords) {
    const res = await fetch(`${API_BASE_URL}/keywords`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(keywords),
    });
    return res.json();
}
