import React, { useEffect, useState } from "react";
import './ProductsPage.css';
import Footer from '../components/Footer';



const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Temporary Fake Products
  const fakeProducts = [
    {
      _id: "1",
      name: "4K Ultra HD CCTV",
      description: "Top-class camera for residential & office surveillance",
      price: 9999,
      category: "cctv",
      image: "https://picsum.photos/300/200?camera1",
    },
    {
      _id: "2",
      name: "Night Vision CCTV",
      description: "See clearly even in pitch darkness",
      price: 7999,
      category: "cctv",
      image: "https://picsum.photos/300/200?camera2",
    },
    {
      _id: "3",
      name: "Modern DVR",
      description: "High-capacity digital video recorder for CCTV",
      price: 12999,
      category: "dvr",
      image: "https://picsum.photos/300/200?camera3",
    },
  ];

  useEffect(() => {
    // ❌ COMMENTED OUT BACKEND CALL UNTIL SERVER IS READY
    /*
    fetch("http://your-backend/api/products") 
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network error");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    */

    // ✅ DIRECTLY USE FAKE PRODUCTS
    setProducts(fakeProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory ? product.category === filterCategory : true;

    return matchSearch && matchCategory;
  });

  if (loading) return <div>Loading Products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-page">
      <h1>Our Products</h1>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="cctv">CCTV</option>
          <option value="dvr">DVR</option>
          <option value="accessory">Accessory</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <h4>₹{product.price}</h4>
              <button>Order Now</button>
            </div>
          ))
        ) : (
          <div>No Products Found</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
