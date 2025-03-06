import axios from "axios";

// Read API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance with default settings
const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Define API functions within an object
const api = {
    /**
     * Admin Login
     * @param {string} email - Admin email
     * @param {string} password - Admin password
     * @returns {Promise<object>} - Returns login response
     */
    adminLogin: async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/admin/login`, { email, password });

            // Save token in localStorage
            localStorage.setItem("token", res.data.token);

            return res.data; // Return success response
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Login failed");
        }
    },
    /**
     * Fetch all items (Read All)
     */
    readAll: async () => {
        try {
            const response = await instance.get("/");
            return response.data;
        } catch (error) {
            console.error("Error fetching all items:", error);
            throw error;
        }
    },

    /**
     * Fetch a single item by ID (Read)
     */
    read: async (id) => {
        try {
            const response = await instance.get(`/item/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching item ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create new item(s) (Create)
     */
    create: async (data) => {
        try {
            const response = await instance.post("/item", data);
            return response.data;
        } catch (error) {
            console.error("Error creating item:", error);
            throw error;
        }
    },

    /**
     * Update an item by ID (Update)
     */
    update: async (id, data) => {
        try {
            const response = await instance.put(`/item/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating item ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete an item by ID (Delete)
     */
    delete: async (id) => {
        try {
            const response = await instance.delete(`/item/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting item ${id}:`, error);
            throw error;
        }
    },
};

export default api;