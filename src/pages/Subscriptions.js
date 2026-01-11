import { useEffect, useState } from "react";
import axios from "axios";

function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [mode, setMode] = useState(null); // add | view | edit | null

  const emptyForm = {
    id: "",
    name: "",
    category: "",
    billing: "Monthly",
    price: "",
    renewalDate: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);

  const fetchSubs = () => {
    axios
      .get("http://localhost:3002/subscriptions")
      .then(res => setSubs(res.data));
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  /* ---------- ACTIONS ---------- */

  const openAdd = () => {
    setFormData(emptyForm);
    setMode("add");
  };

  const openView = sub => {
    setFormData(sub);
    setMode("view");
  };

  const openEdit = sub => {
    setFormData(sub);
    setMode("edit");
  };

  const closeForm = () => {
    setMode(null);
    setFormData(emptyForm);
  };

  const deleteSub = id => {
    if (!window.confirm("Delete this subscription?")) return;
    axios
      .delete(`http://localhost:3002/subscriptions/${id}`)
      .then(fetchSubs);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = e => {
    e.preventDefault();

    if (mode === "add") {
      axios.post("http://localhost:3002/subscriptions", formData)
        .then(() => {
          closeForm();
          fetchSubs();
        });
    }

    if (mode === "edit") {
      axios.put(
        `http://localhost:3002/subscriptions/${formData.id}`,
        formData
      ).then(() => {
        closeForm();
        fetchSubs();
      });
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="page">
      <div className="header">
        <h2>Your Subscriptions</h2>
        <button className="btn btn-success" onClick={openAdd}>
          + Add Subscription
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Billing</th>
              <th>Price</th>
              <th>Renewal</th>
              <th>Status</th>
              <th style={{ width: "160px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subs.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>{s.billing}</td>
                <td>₹ {s.price}</td>
                <td>{s.renewalDate}</td>
                <td>
                  <span className={s.status === "Active" ? "status-active" : "status-expired"}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openView(s)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(s)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSub(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== CENTER FORM OVERLAY ===== */}
      {mode && (
        <div className="overlay">
          <div className="form-card">
            <h4 className="mb-3 text-center">
              {mode === "add" && "Add Subscription"}
              {mode === "view" && "View Subscription"}
              {mode === "edit" && "Edit Subscription"}
            </h4>

            <form onSubmit={submitForm}>
              {[
                ["name", "Service Name", "text"],
                ["category", "Category", "text"],
                ["price", "Price", "number"],
                ["renewalDate", "Renewal Date", "date"],
              ].map(([field, label, type]) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">{label}</label>
                  <input
                    className="form-control"
                    name={field}
                    type={type}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    required
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label">Billing</label>
                <select
                  className="form-select"
                  name="billing"
                  value={formData.billing}
                  onChange={handleChange}
                  disabled={mode === "view"}
                >
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={mode === "view"}
                >
                  <option>Active</option>
                  <option>Expired</option>
                </select>
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>
                  Close
                </button>

                {(mode === "add" || mode === "edit") && (
                  <button type="submit" className="btn btn-primary">
                    {mode === "add" ? "Add" : "Update"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
