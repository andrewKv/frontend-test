import React, { useEffect, useState, useCallback } from "react";
import { ProductDetail, SearchItem } from "../../types";

import { fetchProductDetail, fetchSuggestions } from "../../utils/api";

import "./styles.css";

export const Autocomplete = ({setProductShowing}:{setProductShowing: (product: ProductDetail) => void}) =>  {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);


  const setShowDetailedItem = useCallback(async (searchId: number) => {
    setSuggestions([])
    setSearchTerm("")
    const itemDetails = await fetchProductDetail(searchId);
    setProductShowing(itemDetails)
  }, [setProductShowing]);

  const loadSuggestions = useCallback(async () => {
    const response = await fetchSuggestions(searchTerm);
    const top10Results = response.slice(0, 10)
    setSuggestions(top10Results)
  }, [searchTerm]);

  useEffect(() => {
    const debouncedInput = setTimeout(() => {
      if (searchTerm.length < 1){
        setSuggestions([])
        return
      }
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
            <button onClick={() => setShowDetailedItem(suggestion.id)} className="suggestion-item" key={`item-${index}`}>{suggestion.title} </button>
          ))}
        </div>
      )}
    </div>
  );
}
