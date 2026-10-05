import { useEffect, useState } from "react";

const CATEGORY_API = "http://localhost:5000/api/categories";

function Categories() {
  const emptyForm = {
    name: "",
    description: "",
    status: "ACTIVE",
  };

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(CATEGORY_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories"
        );
      }

      // Backend returns:
      // {
      //   success: true,
      //   count: ...,
      //   data: [...]
      // }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD CATEGORIES ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // HANDLE FORM INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // ADD / UPDATE CATEGORY
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Category name is required.");
      return;
    }

    if (formData.name.trim().length < 2) {
      alert("Category name must be at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      // =========================
      // UPDATE CATEGORY
      // =========================
      if (editingId !== null) {
        const response = await fetch(
          `${CATEGORY_API}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update category"
          );
        }

        alert("Category updated successfully.");
      }

      // =========================
      // ADD CATEGORY
      // =========================
      else {
        const response = await fetch(CATEGORY_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryData.name,
            description: categoryData.description,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to create category"
          );
        }

        alert("Category added successfully.");
      }

      // Get latest data from database
      await fetchCategories();

      // Reset form
      setFormData(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Save category error:", error);

      alert(error.message);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT CATEGORY
  // =========================
  const handleEdit = (category) => {
    setEditingId(category._id);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "ACTIVE",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE / DEACTIVATE CATEGORY
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${CATEGORY_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to deactivate category"
        );
      }

      alert("Category deactivated successfully.");

      // Refresh from database
      await fetchCategories();
    } catch (error) {
      console.error("Delete category error:", error);

      alert(error.message);
      setError(error.message);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  // =========================
  // SEARCH + STATUS FILTER
  // =========================
  const filteredCategories = categories.filter((category) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      category.name
        ?.toLowerCase()
        .includes(searchText) ||
      category.description
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      category.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="page-header">
        <h1>Categories</h1>
        <p>Manage product categories</p>
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* =========================
          ADD / EDIT CATEGORY
      ========================= */}
      <div className="card">
        <h2>
          {editingId !== null
            ? "Edit Category"
            : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* CATEGORY NAME */}
            <div className="form-group">
              <label>Category Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                maxLength="50"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                maxLength="200"
              />
            </div>

            {/* STATUS */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="INACTIVE">
                  INACTIVE
                </option>
              </select>
            </div>

          </div>

          {/* FORM BUTTONS */}
          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Category"
                : "Add Category"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}

          </div>
        </form>
      </div>

      {/* =========================
          SEARCH & FILTERS
      ========================= */}
      <div className="card">
        <h2>Search & Filters</h2>

        <div className="filters">

          {/* SEARCH */}
          <div className="form-group">
            <label>Search Category</label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by category name or description"
            />
          </div>

          {/* STATUS */}
          <div className="form-group">
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="ALL">
                All
              </option>

              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>
            </select>
          </div>

        </div>

        {/* CLEAR FILTERS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* =========================
          CATEGORY LIST
      ========================= */}
      <div className="card">
        <h2>Category List</h2>

        <div className="table-container">

          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {/* LOADING */}
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-row"
                  >
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (

                /* NO DATA */
                <tr>
                  <td
                    colSpan="5"
                    className="empty-row"
                  >
                    No categories found.
                  </td>
                </tr>

              ) : (

                /* CATEGORY DATA */
                filteredCategories.map((category) => (

                  <tr key={category._id}>

                    {/* NAME */}
                    <td>
                      <strong>
                        {category.name}
                      </strong>
                    </td>

                    {/* DESCRIPTION */}
                    <td>
                      {category.description ||
                        "No description"}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={
                          category.status === "ACTIVE"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {category.status}
                      </span>
                    </td>

                    {/* CREATED DATE */}
                    <td>
                      {category.createdAt
                        ? new Date(
                            category.createdAt
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="action-buttons">

                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() =>
                            handleEdit(category)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(category._id)
                          }
                        >
                          Deactivate
                        </button>

                      </div>
                    </td>

                  </tr>

                ))
              )}

            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
}

export default Categories;