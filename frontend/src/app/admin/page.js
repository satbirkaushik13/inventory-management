"use client";

import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { jwtDecode } from 'jwt-decode';

export default function admin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Check token validity on mount
    useEffect(() => {
        const validateToken = () => {
            const token = localStorage.getItem("token"); // Get token from localStorage

            if (!token) {
                // No token, stay on login page
                return;
            }

            try {
                // Decode the JWT
                const decoded = jwtDecode(token);
                if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
                    return;
                }

                const currentTime = Date.now() / 1000; // Current time in seconds

                // Check if token is expired
                if (decoded.exp && decoded.exp < currentTime) {
                    console.error("Token expired:", decoded.exp);
                    localStorage.removeItem("token"); // Remove expired token
                    setError("Session expired. Please log in again.");
                    return;
                }

                // Token is valid, redirect to dashboard
                router.push("/admin/dashboard");
            } catch (err) {
                console.error("Invalid token:", err);
                // localStorage.removeItem("token"); // Remove invalid token
                setError("Invalid token. Please log in again.");
            }
        };

        validateToken();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await api.adminLogin(email, password); // ✅ Use API function
            router.push("/admin/dashboard"); // ✅ Redirect after login
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <section className="h-100 gradient-form" style={{ backgroundColor: "#eee" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="text-center">
                                            <img
                                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                                style={{ width: 185 }}
                                                alt="logo"
                                            />
                                            <h4 className="mt-1 mb-5 pb-1">Fashion Farmers</h4>
                                        </div>
                                        <form onSubmit={handleLogin}>
                                            {error && <p className="text-danger">{error}</p>}
                                            <div data-mdb-input-init="" className="form-outline mb-4">
                                                <label className="form-label" htmlFor="username">
                                                    Email*
                                                </label>
                                                <input
                                                    type="email"
                                                    id="username"
                                                    className="form-control"
                                                    placeholder="Email address"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div data-mdb-input-init="" className="form-outline mb-4">
                                                <label className="form-label" htmlFor="password">
                                                    Password*
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control"
                                                    placeholder="***"
                                                    required
                                                    value={password}
                                                    onChange={(e) => { setPassword(e.target.value) }}
                                                />
                                            </div>
                                            <div className="pt-1 mb-5 pb-1">
                                                <button
                                                    data-mdb-button-init=""
                                                    data-mdb-ripple-init=""
                                                    className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                    type="submit"
                                                >
                                                    Log in
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className={`col-lg-6 d-flex align-items-center ${styles["gradient-custom-2"]}`}>
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">We are more than just a company</h4>
                                        <p className="small mb-0">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                                            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                            laboris nisi ut aliquip ex ea commodo consequat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}