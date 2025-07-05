import React, { useState } from "react";
import "./Products.css";

const Products = () => {
  // ✅ Initialize your products array
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    {
      id: 1,
      title: "4K Ultra HD CCTV",
      description: "Top-class camera for residential & office surveillance",
      imgSrc: "https://picsum.photos/300/200?camera1",
    },
    {
      id: 2,
      title: "Night Vision CCTV",
      description: "See clearly even in pitch darkness",
      imgSrc: "https://picsum.photos/300/200?camera2",
    },
    {
      id: 3,
      title: "360° Smart CCTV",
      description: "Get a full view with pan and tilt",
      imgSrc: "https://picsum.photos/300/200?camera3",
    },
    {
      id: 4,
      title: "Waterproof CCTV",
      description: "Perfect for outdoors and harsh environments",
      imgSrc: "https://picsum.photos/300/200?camera4",
    },
    {
      id: 5,
      title: "WiFi Smart CCTV",
      description: "Control and monitor from your phone",
      imgSrc: "https://picsum.photos/300/200?camera5",
    },
    {
      id: 6,
      title: "PTZ Dome Camera",
      description: "High precision pan-tilt-zoom for wider area",
      imgSrc: "https://picsum.photos/300/200?camera6",
    },
    {
      id: 7,
      title: "4G Sim CCTV",
      description: "Works without internet cables, ideal for remote areas",
      imgSrc: "https://picsum.photos/300/200?camera7",
    },
    {
      id: 8,
      title: "Smart Home CCTV",
      description:
        "Integrate with Alexa, Google Home for seamless surveillance",
      imgSrc: "https://picsum.photos/300/200?camera8",
    },
  ];

  // ✅ Filter based on search
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="product" className="product">
      <h2>Our Products</h2>
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.imgSrc} alt={product.title} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <a href="#" className="btn-secondary">
                Order Now
              </a>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Products;
