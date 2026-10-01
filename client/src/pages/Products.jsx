import { useState } from "react";

function Products() {
  const emptyForm = {
    productName: "",
    sku: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    taxRate: "0",
    stockQuantity: "",
    minimumStock: "",
    status: "ACTIVE"
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "Laptop",
      sku: "LAP001",
      category: "Electronics",
      purchasePrice: 40000,
      sellingPrice: 45000,
      taxRate: 18,
      stockQuantity: 10,
      minimumStock: 2,
      status: "ACTIVE"
    },
    {
      id: 2,
      productName: "Wireless Mouse",
      sku: "MOU001",
      category: "Accessories",
      purchasePrice: 500,
      sellingPrice: 750,
      taxRate: 18,
      stockQuantity: 25,
      minimumStock: 5,
      status: "ACTIVE"
    }
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "sku"
          ? value.toUpperCase()
          : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.productName.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.sku.trim()) {
      alert("SKU is required.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (Number(formData.purchasePrice) < 0) {
      alert("Purchase price cannot be negative.");
      return;
    }

    if (Number(formData.sellingPrice) < 0) {
      alert("Selling price cannot be negative.");
      return;
    }

    if (Number(formData.stockQuantity) < 0) {
      alert("Stock quantity cannot be negative.");
      return;
    }

    if (Number(formData.minimumStock) < 0) {
      alert("Minimum stock cannot be negative.");
      return;
    }

    const productData = {
      ...formData,
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      taxRate: Number(formData.taxRate),
      stockQuantity: Number(formData.stockQuantity),
      minimumStock: Number(formData.minimumStock)
    };

    if (editingId) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId
            ? {
                ...product,
                ...productData
              }
            : product
        )
      );

      alert("Product updated successfully.");
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData
      };

      setProducts((previous) => [
        ...previous,
        newProduct
      ]);

      alert("Product added successfully.");
    }

    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      productName: product.productName,
      sku: product.sku,
      category: product.category,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      taxRate: product.taxRate,
      stockQuantity: product.stockQuantity,
      minimumStock: product.minimumStock,
      status: product.status
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );

    alert("Product deleted successfully.");
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.productName
        .toLowerCase()
        .includes(searchText) ||
      product.sku
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h1>Products</h1>
          <p>Manage your products and pricing</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          + Add Product
        </button>

      </div>

      {showForm && (
        <div className="form-card">

          <div className="card-header">
            <h2>
              {editingId
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <button
              className="close-button"
              onClick={handleCancel}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Product Name *</label>

                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>SKU *</label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>

                  <option value="Stationery">
                    Stationery
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Purchase Price *</label>

                <input
                  type="number"
                  name="purchasePrice"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Selling Price *</label>

                <input
                  type="number"
                  name="sellingPrice"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tax Rate</label>

                <select
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>

                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Minimum Stock *</label>

                <input
                  type="number"
                  name="minimumStock"
                  min="0"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  placeholder="0"
                  required
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
                className="primary-button"
              >
                {editingId
                  ? "Update Product"
                  : "Save Product"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      <div className="content-card">

        <div className="filter-bar">

          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="filter-select"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>
          </select>

        </div>

        <div className="table-container">

          <table className="data-table">

            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Tax</th>
                <th>Stock</th>
                <th>Min Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="empty-row"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>

                    <td>{product.productName}</td>

                    <td>{product.sku}</td>

                    <td>{product.category}</td>

                    <td>
                      ₹{product.purchasePrice}
                    </td>

                    <td>
                      ₹{product.sellingPrice}
                    </td>

                    <td>
                      {product.taxRate}%
                    </td>

                    <td>
                      {product.stockQuantity}
                    </td>

                    <td>
                      {product.minimumStock}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${product.status.toLowerCase()}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                      >
                        Delete
                      </button>
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

export default Products;