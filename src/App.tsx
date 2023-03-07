import React from "react";

import "./App.css";
import {ProductCard, Autocomplete} from "./components";
import { ProductDetail } from "./types";

function App() {
  const [productShowing, setProductShowing] = React.useState<ProductDetail | undefined>(undefined);
  return (
    <div className="App">
      <Autocomplete setProductShowing={setProductShowing}/>
      {productShowing && (<ProductCard product={productShowing} />)}
    </div>
  );
}

export default App;
