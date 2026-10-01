import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";


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
      </main>

    </div>
  );
}

export default App;