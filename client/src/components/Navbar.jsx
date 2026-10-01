function Navbar({ currentPage, setCurrentPage }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          Billing Software
        </div>

        <nav className="nav-links">
          <button
            className={currentPage === "products" ? "nav-link active" : "nav-link"}
            onClick={() => setCurrentPage("products")}
          >
            Products
          </button>

          <button
            className={currentPage === "categories" ? "nav-link active" : "nav-link"}
            onClick={() => setCurrentPage("categories")}
          >
            Categories
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;