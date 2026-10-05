import { useEffect, useState } from "react";

const PRODUCT_API = "http://localhost:5000/api/products";
const CATEGORY_API = "http://localhost:5000/api/categories";

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
    status: "ACTIVE",
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(PRODUCT_API);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH CATEGORIES
  // =========================================

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories"
        );
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  // =========================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================================
  // ADD / UPDATE PRODUCT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!formData.sku.trim()) {
      alert("Product SKU is required.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (
      formData.purchasePrice === "" ||
      Number(formData.purchasePrice) < 0
    ) {
      alert("Purchase price must be 0 or greater.");
      return;
    }

    if (
      formData.sellingPrice === "" ||
      Number(formData.sellingPrice) < 0
    ) {
      alert("Selling price must be 0 or greater.");
      return;
    }

    if (
      formData.stockQuantity === "" ||
      Number(formData.stockQuantity) < 0
    ) {
      alert("Stock quantity must be 0 or greater.");
      return;
    }

    if (
      formData.minimumStock === "" ||
      Number(formData.minimumStock) < 0
    ) {
      alert("Minimum stock must be 0 or greater.");
      return;
    }

    const productData = {
      productName: formData.productName.trim(),

      sku: formData.sku.trim().toUpperCase(),

      category: formData.category,

      purchasePrice: Number(formData.purchasePrice),

      sellingPrice: Number(formData.sellingPrice),

      taxRate: Number(formData.taxRate),

      stockQuantity: Number(formData.stockQuantity),

      minimumStock: Number(formData.minimumStock),

      status: formData.status,
    };

    try {
      setSaving(true);
      setError("");

      // =========================================
      // UPDATE PRODUCT
      // =========================================

      if (editingId !== null) {
        const response = await fetch(
          `${PRODUCT_API}/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(productData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update product"
          );
        }

        alert("Product updated successfully.");
      }

      // =========================================
      // CREATE PRODUCT
      // =========================================

      else {
        const response = await fetch(PRODUCT_API, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(productData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to create product"
          );
        }

        alert("Product added successfully.");
      }

      // =========================================
      // GET FRESH DATA FROM DATABASE
      // =========================================

      await fetchProducts();

      setFormData(emptyForm);

      setEditingId(null);
    } catch (error) {
      console.error("Save product error:", error);

      alert(error.message);

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // EDIT PRODUCT
  // =========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      productName: product.productName || "",

      sku: product.sku || "",

      category: product.category?._id || product.category || "",

      purchasePrice:
        product.purchasePrice?.toString() || "",

      sellingPrice:
        product.sellingPrice?.toString() || "",

      taxRate:
        product.taxRate?.toString() || "0",

      stockQuantity:
        product.stockQuantity?.toString() || "",

      minimumStock:
        product.minimumStock?.toString() || "",

      status: product.status || "ACTIVE",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${PRODUCT_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      alert("Product deleted successfully.");

      await fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);

      alert(error.message);
    }
  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancel = () => {
    setFormData(emptyForm);

    setEditingId(null);
  };

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      product.productName
        ?.toLowerCase()
        .includes(searchText) ||
      product.sku
        ?.toLowerCase()
        .includes(searchText);

    const productCategoryId =
      product.category?._id || product.category;

    const matchesCategory =
      categoryFilter === "ALL" ||
      productCategoryId === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      product.status === statusFilter;

    const matchesMinPrice =
      minPrice === "" ||
      product.sellingPrice >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" ||
      product.sellingPrice <= Number(maxPrice);

    const isLowStock =
      product.stockQuantity <=
      product.minimumStock;

    const matchesLowStock =
      !lowStockOnly || isLowStock;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesLowStock
    );
  });

  // =========================================
  // CLEAR FILTERS
  // =========================================

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
    setMinPrice("");
    setMaxPrice("");
    setLowStockOnly(false);
  };

  // =========================================
  // GET CATEGORY NAME
  // =========================================

  const getCategoryName = (product) => {
    if (product.category?.name) {
      return product.category.name;
    }

    const category = categories.find(
      (item) =>
        item._id === product.category
    );

    return category?.name || "Unknown";
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="page-container">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="page-header">
        <h1>Products</h1>

        <p>
          Manage products and inventory details
        </p>
      </div>


      {/* =================================
          ERROR MESSAGE
      ================================= */}

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


      {/* =================================
          ADD / EDIT PRODUCT
      ================================= */}

      <div className="card">

        <h2>
          {editingId !== null
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Product Name */}

            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
              />

            </div>


            {/* SKU */}

            <div className="form-group">

              <label>
                Product Code / SKU
              </label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
              />

            </div>


            {/* Category */}

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>

            </div>


            {/* Purchase Price */}

            <div className="form-group">

              <label>
                Purchase Price
              </label>

              <input
                type="number"
                name="purchasePrice"
                min="0"
                value={formData.purchasePrice}
                onChange={handleChange}
                placeholder="Enter purchase price"
              />

            </div>


            {/* Selling Price */}

            <div className="form-group">

              <label>
                Selling Price
              </label>

              <input
                type="number"
                name="sellingPrice"
                min="0"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Enter selling price"
              />

            </div>


            {/* Tax Rate */}

            <div className="form-group">

              <label>
                Tax Rate
              </label>

              <select
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
              >

                <option value="0">
                  0%
                </option>

                <option value="5">
                  5%
                </option>

                <option value="12">
                  12%
                </option>

                <option value="18">
                  18%
                </option>

              </select>

            </div>


            {/* Stock Quantity */}

            <div className="form-group">

              <label>
                Stock Quantity
              </label>

              <input
                type="number"
                name="stockQuantity"
                min="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="Enter stock quantity"
              />

            </div>


            {/* Minimum Stock */}

            <div className="form-group">

              <label>
                Minimum Stock
              </label>

              <input
                type="number"
                name="minimumStock"
                min="0"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="Enter minimum stock"
              />

            </div>


            {/* Status */}

            <div className="form-group">

              <label>
                Status
              </label>

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


          {/* Form Buttons */}

          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Product"
                : "Add Product"}

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


      {/* =================================
          SEARCH & FILTERS
      ================================= */}

      <div className="card">

        <h2>
          Search & Filters
        </h2>

        <div className="filters">

          {/* Search */}

          <div className="form-group">

            <label>
              Search Product
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by product name or SKU"
            />

          </div>


          {/* Category Filter */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >

              <option value="ALL">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>


          {/* Status Filter */}

          <div className="form-group">

            <label>
              Status
            </label>

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


          {/* Minimum Price */}

          <div className="form-group">

            <label>
              Minimum Selling Price
            </label>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value)
              }
              placeholder="Min price"
            />

          </div>


          {/* Maximum Price */}

          <div className="form-group">

            <label>
              Maximum Selling Price
            </label>

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
              placeholder="Max price"
            />

          </div>

        </div>


        {/* Low Stock */}

        <div className="low-stock-filter">

          <label>

            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) =>
                setLowStockOnly(e.target.checked)
              }
            />

            Show Low Stock Products Only

          </label>

        </div>


        {/* Clear Filters */}

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


      {/* =================================
          PRODUCT LIST
      ================================= */}

      <div className="card">

        <h2>
          Product List
        </h2>

        <div className="table-container product-table-container">

          <table className="product-table">

            <thead>

              <tr>

                <th>
                  Product Name
                </th>

                <th>
                  SKU
                </th>

                <th>
                  Category
                </th>

                <th>
                  Purchase Price
                </th>

                <th>
                  Selling Price
                </th>

                <th>
                  Tax
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Min Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    className="empty-row"
                  >
                    Loading products...
                  </td>

                </tr>

              ) : filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="empty-row"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                filteredProducts.map((product) => {

                  const isLowStock =
                    product.stockQuantity <=
                    product.minimumStock;

                  return (

                    <tr key={product._id}>

                      {/* Product Name */}

                      <td>

                        <strong>
                          {product.productName}
                        </strong>

                      </td>


                      {/* SKU */}

                      <td>
                        {product.sku}
                      </td>


                      {/* Category */}

                      <td>
                        {getCategoryName(product)}
                      </td>


                      {/* Purchase Price */}

                      <td>
                        ₹
                        {Number(
                          product.purchasePrice
                        ).toLocaleString("en-IN")}
                      </td>


                      {/* Selling Price */}

                      <td>
                        ₹
                        {Number(
                          product.sellingPrice
                        ).toLocaleString("en-IN")}
                      </td>


                      {/* Tax */}

                      <td>
                        {product.taxRate}%
                      </td>


                      {/* Stock */}

                      <td>

                        <strong
                          style={{
                            color: isLowStock
                              ? "#dc2626"
                              : "#334155",
                          }}
                        >
                          {product.stockQuantity}
                        </strong>

                      </td>


                      {/* Minimum Stock */}

                      <td>
                        {product.minimumStock}
                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={
                            product.status ===
                            "ACTIVE"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {product.status}
                        </span>

                      </td>


                      {/* Actions */}

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() =>
                              handleEdit(product)
                            }
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Products;