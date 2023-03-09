import React, { useEffect, useState, useCallback } from "react";
import { ProductDetail, SearchItem } from "../../types";

import { fetchProductDetail, fetchSuggestions } from "../../utils/api";
import { Spinner } from "../Spinner";

import "./styles.css";

export const Autocomplete = ({setProductShowing}:{setProductShowing: (product: ProductDetail) => void}) =>  {
  // ideally should probably have these use states in a reducer, so that they can be set within one dispatch action
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [showErrorHeader, setShowErrorHeader] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const setShowDetailedItem = useCallback(async (searchId: number) => {
    setSuggestions([])
    setSearchTerm("")
    const itemDetails = await fetchProductDetail(searchId);
    setProductShowing(itemDetails)
  }, [setProductShowing]);

  const loadSuggestions = useCallback(async () => {
    try {
      setShowSpinner(true)
      const response = await fetchSuggestions(searchTerm)
      if (response){
        const top10Results = response.slice(0, 10)
        setSuggestions(top10Results)
        setShowSpinner(false)
      }
    }catch (error) {
      console.log(`Error fetching data: ${error}`)
      setShowErrorHeader(true)
    }
  }, [searchTerm]);

  useEffect(() => {
    if(!showErrorHeader){
      return
    }
    const errorShowing = setTimeout(() => {
      setShowErrorHeader(false)
      setShowSpinner(false) // if there's fetch error, stop spinner when message disappears
    }, 3000);

    return () => clearTimeout(errorShowing);
  }, [loadSuggestions, searchTerm, showErrorHeader]);

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

  return (
    <div className="search-container">
      {showErrorHeader && (<div className="error-banner">
        An error occurred while fetching the data. Please try again.
      </div>)}
      <input
        type="text"
        value={searchTerm}
        className="search-box"
        placeholder="Search for a product"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* This is really just to show PoC. I think a spinner isn't really useful here as it's distracting, to improve it we should display it after a minimum of 1 second awaiting a fetch */}
      {showSpinner && ( <Spinner />)}
      {suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <button role='suggestion' onClick={() => setShowDetailedItem(suggestion.id)} className="suggestion-item" key={`item-${index}`}>{suggestion.title} </button>
          ))}
        </div>
      )}
      {/* TODO: handle search suggestions overflow on phone with scrollbar? */}
    </div>
  );
}
