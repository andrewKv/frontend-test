import React, { useState, useEffect } from "react";
import { ProductDetail } from "../../types";

import "./styles.css";

export const ProductCard = ({ product }: {product: ProductDetail})  => {
  console.log(product)
  return (
      <div className="detail-container">
        <div className="row">
          <img src={product.image} className="product-image" />
        </div>
        <div className="row">
          <div className="row-title">Name:</div>
          <div className="row-body">{product.title}</div>
        </div>
        <div className="row">
          <div className="row-title">Name:</div>
          <div className="row-body">{product.description}</div>
        </div>
        <div className="row">
          <div className="row-title">Price:</div>
          <div className="row-body">{product.price}</div>
        </div>
      </div>
    );
}
