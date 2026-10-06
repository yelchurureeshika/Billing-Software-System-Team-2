import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";

function App() {
  const [currentPage, setCurrentPage] = useState("products");

  return (
    <div className="app">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main>
        {currentPage === "products" && <Products />}

        {currentPage === "categories" && <Categories />}

        {currentPage === "inventory" && <Inventory />}
      </main>
    </div>
  );
}

export default App;