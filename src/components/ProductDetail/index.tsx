import React, { useEffect, useState } from "react";
import { ProductDetail } from "../../types";
import { Spinner } from "../Spinner";

import "./styles.css";

export const ProductCard = ({ product }: {product: ProductDetail})  => {
  const [expandedDescription, setExpandedDescription] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  const formattedPrice = product.price.toLocaleString('en-UK', {style: 'currency', currency: 'GBP'});

  const imageLoaded = () => {
    setLoadingImage(false);
  }
  
  const showMore = () => {
    setExpandedDescription(!expandedDescription)
  }

  useEffect(() => {
    setLoadingImage(true)
  }, [product.image])

  return (
      <div className="detail-container">
        {/* Image needs to be in the dom to actually load, so loading spinner is rendered above */}
        {loadingImage && (<Spinner />)}     
        <img src={product.image} className={loadingImage? "hidden" : "product-image"} alt={`Product ${product.title}`} onLoad={imageLoaded} />

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
