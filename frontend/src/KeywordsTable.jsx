import React, { useEffect, useState } from "react";
import { fetchKeywords, addKeywords, deleteItem, getItemKeywords, addItemKeywords } from "./api";

function KeywordsTable() {
    const [keywords, setKeywords] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [newKeywords, setNewKeywords] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [assignItemId, setAssignItemId] = useState("");
    const [assignKeywords, setAssignKeywords] = useState([]);
    const [assignResult, setAssignResult] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const res = await fetchKeywords({ page, pageSize });
        setKeywords(res.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [page]);

    const handleAddKeywordField = () => {
        setNewKeywords([...newKeywords, ""]);
    };

    const handleKeywordChange = (idx, value) => {
        const updated = [...newKeywords];
        updated[idx] = value;
        setNewKeywords(updated);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const keywordsToAdd = newKeywords.filter((k) => k.trim()).map((keyword_name) => ({ keyword_name }));
        if (keywordsToAdd.length) {
            await addKeywords(keywordsToAdd);
            setShowForm(false);
            setNewKeywords([""]);
            fetchData();
        }
    };

    // Keyword assignment to item
    const handleAssignKeywords = async (e) => {
        e.preventDefault();
        if (!assignItemId || assignKeywords.length === 0) return;
        const result = await addItemKeywords(
            assignItemId,
            assignKeywords.map((id) => ({ keyword_id: id }))
        );
        setAssignResult(result.message);
    };

    const handleFetchItemKeywords = async () => {
        if (!assignItemId) return;
        const res = await getItemKeywords(assignItemId);
        setAssignKeywords((res.data?.keywords || []).map((k) => k.keyword_id));
    };

    return (
        <div className="items-table-container">
            <div className="table-header">
                <h2>Keywords</h2>
                <button onClick={() => setShowForm(true)}>Add Keyword(s)</button>
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
                    ) : keywords.length === 0 ? (
                        <tr>
                            <td colSpan={2}>No keywords found.</td>
                        </tr>
                    ) : (
                        keywords.map((keyword) => (
                            <tr key={keyword.keyword_id}>
                                <td>{keyword.keyword_id}</td>
                                <td>{keyword.keyword_name}</td>
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
                <button onClick={() => setPage((p) => p + 1)} disabled={keywords.length < pageSize}>
                    Next
                </button>
            </div>
            {showForm && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Add Keywords</h3>
                        <form onSubmit={handleFormSubmit}>
                            {newKeywords.map((keyword, idx) => (
                                <div className="form-group" key={idx}>
                                    <input
                                        value={keyword}
                                        onChange={(e) => handleKeywordChange(idx, e.target.value)}
                                        placeholder="Keyword Name"
                                        required
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddKeywordField}>
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
            {/* Assign keywords to item */}
            <div style={{ marginTop: 32 }}>
                <h3>Assign Keywords to Item</h3>
                <form onSubmit={handleAssignKeywords} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        type="number"
                        placeholder="Item ID"
                        value={assignItemId}
                        onChange={(e) => setAssignItemId(e.target.value)}
                        style={{ width: 100 }}
                    />
                    <button type="button" onClick={handleFetchItemKeywords}>
                        Fetch Item Keywords
                    </button>
                    <select
                        multiple
                        value={assignKeywords}
                        onChange={(e) =>
                            setAssignKeywords(Array.from(e.target.selectedOptions, (o) => Number(o.value)))
                        }
                        style={{ minWidth: 200, minHeight: 80 }}
                    >
                        {keywords.map((k) => (
                            <option key={k.keyword_id} value={k.keyword_id}>
                                {k.keyword_name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Assign</button>
                </form>
                {assignResult && <div style={{ marginTop: 8, color: "green" }}>{assignResult}</div>}
            </div>
        </div>
    );
}

export default KeywordsTable;
