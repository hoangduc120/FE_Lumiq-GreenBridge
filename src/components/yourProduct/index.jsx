import React from "react";

function YourProduct({ product }) {
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  );
}

export default YourProduct;
