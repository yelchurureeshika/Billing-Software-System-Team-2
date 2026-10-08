import { useEffect, useMemo, useState } from "react";

const INVENTORY_API = "http://localhost:5000/api/inventory";

function Inventory() {
  const [inventory, setInventory] = useState([]);

  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    inStockCount: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [operation, setOperation] = useState("add");
  const [quantity, setQuantity] = useState("");

  const [adjusting, setAdjusting] = useState(false);

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(INVENTORY_API);

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();

      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory summary
  const fetchSummary = async () => {
    try {
      const response = await fetch(`${INVENTORY_API}/summary`);

      if (!response.ok) {
        throw new Error("Failed to fetch inventory summary");
      }

      const data = await response.json();

      setSummary({
        totalProducts: data.totalProducts || 0,
        totalStock: data.totalStock || 0,
        lowStockCount: data.lowStockCount || 0,
        inStockCount: data.inStockCount || 0,
      });
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchSummary();
  }, []);

  // Search and filters
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        item.productName?.toLowerCase().includes(searchText) ||
        item.sku?.toLowerCase().includes(searchText);

      const matchesStatus =
        !statusFilter || item.status === statusFilter;

      const matchesLowStock =
        !lowStockOnly || item.lowStock === true;

      const matchesMinQuantity =
        minQuantity === "" ||
        Number(item.stockQuantity) >= Number(minQuantity);

      const matchesMaxQuantity =
        maxQuantity === "" ||
        Number(item.stockQuantity) <= Number(maxQuantity);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLowStock &&
        matchesMinQuantity &&
        matchesMaxQuantity
      );
    });
  }, [
    inventory,
    search,
    statusFilter,
    lowStockOnly,
    minQuantity,
    maxQuantity,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setLowStockOnly(false);
    setMinQuantity("");
    setMaxQuantity("");
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setOperation("add");
    setQuantity("");
    setShowModal(true);
    setError("");
  };

  const closeAdjustModal = () => {
    if (adjusting) return;

    setShowModal(false);
    setSelectedProduct(null);
    setQuantity("");
    setOperation("add");
  };

  const handleAdjustStock = async (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    const enteredQuantity = Number(quantity);

    if (quantity === "" || Number.isNaN(enteredQuantity)) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (enteredQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    if (operation !== "set" && enteredQuantity === 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (
      operation === "subtract" &&
      enteredQuantity > Number(selectedProduct.stockQuantity)
    ) {
      alert("Stock quantity cannot become negative.");
      return;
    }

    try {
      setAdjusting(true);

      const requestBody =
        operation === "set"
          ? {
              productId: selectedProduct._id,
              stockQuantity: enteredQuantity,
              operation: "set",
            }
          : {
              productId: selectedProduct._id,
              quantity: enteredQuantity,
              operation,
            };

      const response = await fetch(`${INVENTORY_API}/adjust`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to adjust inventory"
        );
      }

      alert("Stock updated successfully.");

      closeAdjustModal();

      await fetchInventory();
      await fetchSummary();
    } catch (err) {
      alert(err.message || "Failed to update stock.");
    } finally {
      setAdjusting(false);
    }
  };

  const formatPrice = (value) => {
    return `₹${Number(value || 0).toFixed(2)}`;
  };

  return (
    <div className="page-container inventory-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Manage product stock and inventory levels.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="inventory-summary">

        <div className="summary-card">
          <div className="summary-title">
            Total Products
          </div>

          <div className="summary-value">
            {summary.totalProducts}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-title">
            Total Stock
          </div>

          <div className="summary-value">
            {summary.totalStock}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-title">
            Low Stock
          </div>

          <div className="summary-value">
            {summary.lowStockCount}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-title">
            In Stock
          </div>

          <div className="summary-value">
            {summary.inStockCount}
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="card filter-card">

        <h2>Search & Filter Inventory</h2>

        <div className="filter-grid">

          <div className="form-group">
            <label>Search Product / SKU</label>

            <input
              type="text"
              placeholder="Search by product name or SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Minimum Stock</label>

            <input
              type="number"
              min="0"
              placeholder="Min quantity"
              value={minQuantity}
              onChange={(e) =>
                setMinQuantity(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Maximum Stock</label>

            <input
              type="number"
              min="0"
              placeholder="Max quantity"
              value={maxQuantity}
              onChange={(e) =>
                setMaxQuantity(e.target.value)
              }
            />
          </div>

        </div>

        <div className="inventory-filter-actions">

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) =>
                setLowStockOnly(e.target.checked)
              }
            />

            Show Low Stock Only
          </label>

          <button
            type="button"
            className="btn-secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Inventory Table */}
      <div className="card table-card">

        <div className="table-header">
          <div>
            <h2>Inventory List</h2>

            <p>
              Showing {filteredInventory.length} of{" "}
              {inventory.length} products
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            Loading inventory...
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="empty-state">
            No inventory items found.
          </div>
        ) : (
          <div className="product-table-container">

            <table className="product-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Purchase Price</th>
                  <th>Selling Price</th>
                  <th>Tax</th>
                  <th>Current Stock</th>
                  <th>Minimum Stock</th>
                  <th>Inventory Status</th>
                  <th>Product Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredInventory.map((item) => (
                  <tr
                    key={item._id}
                    className={
                      item.lowStock
                        ? "low-stock-row"
                        : ""
                    }
                  >

                    <td>
                      <strong>
                        {item.productName}
                      </strong>
                    </td>

                    <td>{item.sku}</td>

                    <td>
                      {formatPrice(item.purchasePrice)}
                    </td>

                    <td>
                      {formatPrice(item.sellingPrice)}
                    </td>

                    <td>{item.taxRate}%</td>

                    <td>
                      <strong>
                        {item.stockQuantity}
                      </strong>
                    </td>

                    <td>{item.minimumStock}</td>

                    <td>
                      {item.lowStock ? (
                        <span className="status-badge inactive">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="status-badge active">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          item.status === "ACTIVE"
                            ? "status-badge active"
                            : "status-badge inactive"
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-primary-small"
                        onClick={() =>
                          openAdjustModal(item)
                        }
                      >
                        Adjust Stock
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Adjust Stock Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>Adjust Stock</h2>

            <div className="modal-product">

              <strong>
                {selectedProduct.productName}
              </strong>

              <span>
                SKU: {selectedProduct.sku}
              </span>

            </div>

            <div className="modal-stock">
              Current Stock:{" "}
              <strong>
                {selectedProduct.stockQuantity}
              </strong>
            </div>

            <form onSubmit={handleAdjustStock}>

              <div className="form-group">

                <label>Operation</label>

                <select
                  value={operation}
                  onChange={(e) =>
                    setOperation(e.target.value)
                  }
                  disabled={adjusting}
                >

                  <option value="add">
                    Add Stock
                  </option>

                  <option value="subtract">
                    Subtract Stock
                  </option>

                  <option value="set">
                    Set Stock
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  {operation === "set"
                    ? "New Stock Quantity"
                    : "Quantity"}
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  disabled={adjusting}
                  required
                />

              </div>

              {operation === "subtract" &&
                quantity !== "" && (
                  <p className="stock-preview">
                    Remaining Stock:{" "}
                    {Math.max(
                      0,
                      Number(
                        selectedProduct.stockQuantity
                      ) - Number(quantity)
                    )}
                  </p>
                )}

              {operation === "add" &&
                quantity !== "" && (
                  <p className="stock-preview">
                    New Stock:{" "}
                    {Number(
                      selectedProduct.stockQuantity
                    ) + Number(quantity)}
                  </p>
                )}

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeAdjustModal}
                  disabled={adjusting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={adjusting}
                >
                  {adjusting
                    ? "Updating..."
                    : "Update Stock"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Inventory;