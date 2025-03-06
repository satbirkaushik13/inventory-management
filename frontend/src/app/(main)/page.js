"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Home() {
	const [items, setItems] = useState([]);
	// Fetch all items on component mount
	useEffect(() => {
		fetchItems();
	}, []);

	const fetchItems = async () => {
		try {
			const data = await api.readAll();
			setItems(data);
		} catch (error) {
			console.error("Failed to fetch items", error);
		}
	};

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Image
					className={styles.logo}
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<h2>{items ? items : "Loading..."}</h2>
			</main>
		</div>
	);
}