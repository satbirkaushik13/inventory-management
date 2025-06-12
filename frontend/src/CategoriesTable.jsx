import React, { useEffect, useState } from "react";
import { fetchCategories, addCategories } from "./api";

function buildCategoryTree(categories) {
    const map = {};
    categories.forEach((cat) => (map[cat.category_id] = { ...cat, children: [] }));
    const tree = [];
    categories.forEach((cat) => {
        if (cat.category_parent_id && map[cat.category_parent_id]) {
            map[cat.category_parent_id].children.push(map[cat.category_id]);
        } else {
            tree.push(map[cat.category_id]);
        }
    });
    return tree;
}

function renderCategoryRows(tree, level = 0) {
    return tree.flatMap((cat) => [
        <tr key={cat.category_id}>
            <td>{cat.category_id}</td>
            <td style={{ paddingLeft: `${level * 24}px` }}>{cat.category_name}</td>
            <td>{cat.category_parent_id}</td>
        </tr>,
        ...renderCategoryRows(cat.children, level + 1),
    ]);
}

function CategoriesTable() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newCategories, setNewCategories] = useState([{ category_name: "", category_parent_id: 0 }]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const res = await fetchCategories({ page: 1, pageSize: 1000 });
        setCategories(res.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategoryField = () => {
        setNewCategories([...newCategories, { category_name: "", category_parent_id: 0 }]);
    };

    const handleCategoryChange = (idx, field, value) => {
        const updated = [...newCategories];
        updated[idx][field] = value;
        setNewCategories(updated);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const catsToAdd = newCategories.filter((c) => c.category_name.trim());
        if (catsToAdd.length) {
            await addCategories(catsToAdd);
            setShowForm(false);
            setNewCategories([{ category_name: "", category_parent_id: 0 }]);
            fetchData();
        }
    };

    const tree = buildCategoryTree(categories);

    return (
        <div className="items-table-container">
            <div className="table-header">
                <h2>Categories</h2>
                <button onClick={() => setShowForm(true)}>Add Category(s)</button>
            </div>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Parent ID</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={3}>Loading...</td>
                        </tr>
                    ) : categories.length === 0 ? (
                        <tr>
                            <td colSpan={3}>No categories found.</td>
                        </tr>
                    ) : (
                        renderCategoryRows(tree)
                    )}
                </tbody>
            </table>
            {showForm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Add Categories</h3>
                        <form onSubmit={handleFormSubmit}>
                            {newCategories.map((cat, idx) => (
                                <div className="form-group" key={idx}>
                                    <input
                                        value={cat.category_name}
                                        onChange={(e) => handleCategoryChange(idx, "category_name", e.target.value)}
                                        placeholder="Category Name"
                                        required
                                    />
                                    <input
                                        value={cat.category_parent_id}
                                        onChange={(e) =>
                                            handleCategoryChange(idx, "category_parent_id", e.target.value)
                                        }
                                        placeholder="Parent ID (0 for root)"
                                        type="number"
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddCategoryField}>
                                Add More
                            </button>
                            <div className="modal-actions">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriesTable;
