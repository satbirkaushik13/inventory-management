import React, { useEffect, useState } from "react";
import { fetchItems, addItem, updateItem, deleteItem, getItem, uploadItemImage } from "./api";
import "./Dashboard.css";

function ItemForm({ open, onClose, onSubmit, initialData, isEdit }) {
    const [form, setForm] = useState(
        initialData || {
            item_name: "",
            item_description: "",
            item_brand_id: "",
            item_category_id: "",
            item_size_id: "",
            item_size_type_id: "",
            item_stock: "",
            item_cost_price: "",
            item_discount_in: "",
            item_selling_price: "",
            item_discount_out: "",
            item_including_taxes: "",
            item_tax_paid_value: "",
            item_status: "1",
        }
    );
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form, image);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{isEdit ? "Edit Item" : "Add New Item"}</h3>
                <form onSubmit={handleSubmit}>
                    {Object.keys(form).map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key.replace(/_/g, " ")}</label>
                            <input
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                required={key !== "item_discount_in" && key !== "item_discount_out"}
                            />
                        </div>
                    ))}
                    <div className="form-group">
                        <label>Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" disabled={uploading}>
                            {isEdit ? "Update" : "Add"}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ItemViewModal({ open, onClose, item }) {
    if (!open || !item) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Item Details</h3>
                <pre style={{ maxHeight: 300, overflow: "auto" }}>{JSON.stringify(item, null, 2)}</pre>
                <div className="modal-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

function ItemsTable() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [viewItem, setViewItem] = useState(null);
    const [viewModal, setViewModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const res = await fetchItems({ page, pageSize });
        setItems(res.data || []);
        setTotal(res.total || 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [page, pageSize]);

    const handleAdd = () => {
        setEditItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item_id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            await deleteItem(item_id);
            fetchData();
        }
    };

    const handleFormSubmit = async (form, image) => {
        let res;
        if (editItem) {
            res = await updateItem(editItem.item_id, form);
        } else {
            res = await addItem(form);
        }
        if (res.status === 1 && res.data?.insertedId && image) {
            await uploadItemImage(res.data.insertedId, image);
        }
        setShowForm(false);
        fetchData();
    };

    const handleView = async (item_id) => {
        const res = await getItem(item_id);
        setViewItem(res.data);
        setViewModal(true);
    };

    return (
        <div className="items-table-container">
            <div className="table-header">
                <h2>Items</h2>
                <button onClick={handleAdd}>Add New Item</button>
            </div>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Stock</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={8}>Loading...</td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan={8}>No items found.</td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.item_id}>
                                <td>{item.item_id}</td>
                                <td>{item.item_name}</td>
                                <td>{item.item_description}</td>
                                <td>{item.item_stock}</td>
                                <td>{item.item_cost_price}</td>
                                <td>{item.item_selling_price}</td>
                                <td>{item.item_status === 1 ? "Active" : "Inactive"}</td>
                                <td>
                                    <button onClick={() => handleView(item.item_id)}>View</button>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.item_id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    Prev
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={items.length < pageSize}>
                    Next
                </button>
            </div>
            <ItemForm
                open={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleFormSubmit}
                initialData={editItem}
                isEdit={!!editItem}
            />
            <ItemViewModal open={viewModal} onClose={() => setViewModal(false)} item={viewItem} />
        </div>
    );
}

export default ItemsTable;
