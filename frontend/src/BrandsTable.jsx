import React, { useEffect, useState } from "react";
import { fetchBrands, addBrands } from "./api";

function BrandsTable() {
    const [brands, setBrands] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [newBrands, setNewBrands] = useState([""]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const res = await fetchBrands({ page, pageSize });
        setBrands(res.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [page]);

    const handleAddBrandField = () => {
        setNewBrands([...newBrands, ""]);
    };

    const handleBrandChange = (idx, value) => {
        const updated = [...newBrands];
        updated[idx] = value;
        setNewBrands(updated);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const brandsToAdd = newBrands.filter((b) => b.trim()).map((brand_name) => ({ brand_name }));
        if (brandsToAdd.length) {
            await addBrands(brandsToAdd);
            setShowForm(false);
            setNewBrands([""]);
            fetchData();
        }
    };

    return (
        <div className="items-table-container">
            <div className="table-header">
                <h2>Brands</h2>
                <button onClick={() => setShowForm(true)}>Add Brand(s)</button>
            </div>
            <table className="items-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={2}>Loading...</td>
                        </tr>
                    ) : brands.length === 0 ? (
                        <tr>
                            <td colSpan={2}>No brands found.</td>
                        </tr>
                    ) : (
                        brands.map((brand) => (
                            <tr key={brand.brand_id}>
                                <td>{brand.brand_id}</td>
                                <td>{brand.brand_name}</td>
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
                <button onClick={() => setPage((p) => p + 1)} disabled={brands.length < pageSize}>
                    Next
                </button>
            </div>
            {showForm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Add Brands</h3>
                        <form onSubmit={handleFormSubmit}>
                            {newBrands.map((brand, idx) => (
                                <div className="form-group" key={idx}>
                                    <input
                                        value={brand}
                                        onChange={(e) => handleBrandChange(idx, e.target.value)}
                                        placeholder="Brand Name"
                                        required
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddBrandField}>
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

export default BrandsTable;
