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

      setCategories(data.data || []);
    } catch (error) {
      console.error(
        "Fetch categories error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Category name is required.");
      return;
    }

    if (formData.name.trim().length < 2) {
      alert(
        "Category name must be at least 2 characters."
      );
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

      let response;

      if (editingId !== null) {
        response = await fetch(
          `${CATEGORY_API}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
          }
        );
      } else {
        response = await fetch(CATEGORY_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryData.name,
            description: categoryData.description,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingId !== null
              ? "Failed to update category"
              : "Failed to create category")
        );
      }

      alert(
        editingId !== null
          ? "Category updated successfully."
          : "Category added successfully."
      );

      await fetchCategories();

      setFormData(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      alert(error.message);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

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
          data.message ||
            "Failed to deactivate category"
        );
      }

      alert(
        "Category deactivated successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      alert(error.message);
      setError(error.message);
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const filteredCategories =
    categories.filter((category) => {
      const searchText =
        search.toLowerCase().trim();

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

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="page-container category-page">

      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage product categories</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ADD / EDIT CATEGORY */}

      <div className="page-card">

        <div className="section-header">
          <h2>
            {editingId !== null
              ? "Edit Category"
              : "Add Category"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="category-form-grid">

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

      {/* SEARCH & FILTERS */}

      <div className="page-card">

        <div className="section-header">
          <h2>Search & Filters</h2>
        </div>

        <div className="category-filter-grid">

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

        <div className="filter-bottom-row">

          <div></div>

          <button
            type="button"
            className="btn-secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* CATEGORY LIST */}

      <div className="page-card">

        <div className="table-header">
          <div>
            <h2>Category List</h2>

            <p>
              Showing {filteredCategories.length} of{" "}
              {categories.length} categories
            </p>
          </div>
        </div>

        <div className="table-container">

          <table className="management-table category-list-table">

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
                <tr>
                  <td
                    colSpan="5"
                    className="empty-row"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map(
                  (category) => (
                    <tr key={category._id}>

                      <td>
                        <strong>
                          {category.name}
                        </strong>
                      </td>

                      <td>
                        {category.description ||
                          "No description"}
                      </td>

                      <td>
                        <span
                          className={
                            category.status ===
                            "ACTIVE"
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                        >
                          {category.status}
                        </span>
                      </td>

                      <td>
                        {category.createdAt
                          ? new Date(
                              category.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td>
                        <div className="action-buttons">

                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() =>
                              handleDelete(
                                category._id
                              )
                            }
                          >
                            Deactivate
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Categories;