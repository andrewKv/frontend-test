import React, { useEffect, useState, useCallback } from "react";
import { ProductDetail, SearchItem } from "../../types";

import { fetchProductDetail, fetchSuggestions } from "../../utils/api";

import "./styles.css";

export const Autocomplete = ({setProductShowing}:{setProductShowing: (product: ProductDetail) => void}) =>  {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);


  const setShowDetailedItem = useCallback(async (searchId: number) => {
    const itemDetails = await fetchProductDetail(searchId);
    setProductShowing(itemDetails)
  }, [searchTerm]);

  const loadSuggestions = useCallback(async () => {
    const response = await fetchSuggestions(searchTerm);
    setSuggestions(response)
  }, [searchTerm]);

  useEffect(() => {
    const debouncedInput = setTimeout(() => {
      loadSuggestions()
    }, 500);

    return () => clearTimeout(debouncedInput);
  }, [loadSuggestions, searchTerm]);
  console.log(suggestions)
  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        className="search-box"
        placeholder="Search for a product"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <button onClick={() => setShowDetailedItem(suggestion.id)} className="suggestion" key={`item-${index}`}>{suggestion.title} </button>
          ))}
        </div>
      )}
    </div>
  );
}
