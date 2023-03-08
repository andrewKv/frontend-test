import React, { useState } from "react";
import { ProductDetail } from "../../types";

import "./styles.css";

// product card tests

export const ProductCard = ({ product }: {product: ProductDetail})  => {
  const formattedPrice = product.price.toLocaleString('en-UK', {style: 'currency', currency: 'GBP'});
  const [expandedDescription, setExpandedDescription] = useState<boolean>(false);
  const showMore = () => {
    setExpandedDescription(!expandedDescription)
  }

  return (
      <div className="detail-container">
        <div>
          <img src={product.image} className="product-image" alt={`Product ${product.title}`} />
        </div>
        {/* TODO: move text to flex-end */}
        <div className="row bold">
          {product.title}
        </div>
        <div className={expandedDescription? "row expanded": "row"} onClick={showMore}>{product.description}</div>
        <div className="row bold">
          {formattedPrice}
        </div>
      </div>
    );
}
