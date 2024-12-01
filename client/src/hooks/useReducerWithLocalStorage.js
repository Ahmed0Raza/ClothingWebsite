import { useEffect, useReducer, useRef } from "react";
import axios from "axios";

export default function useReducerWithLocalStorage(reducer, initialState, storageKey) {
  // Keep track of whether we've fetched discounts after initial load
  const initialFetchDone = useRef(false);
  const API_HOST = import.meta.env.VITE_API_HOST
  const [storedState, dispatch] = useReducer(reducer, initialState, (initialState) => {
    try {
      
      const persisted = window.localStorage.getItem(storageKey);
      //console.log(persisted)
      return persisted ? JSON.parse(persisted) : initialState;
    } catch (error) {
      //console.log(error);
      return initialState;
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storedState));
  }, [storedState, storageKey]);

  // Fetch discounts only on initial load and when products explicitly change
  useEffect(() => {
    const fetchUpdatedDiscounts = async () => {
      const productDiscounts = {}; // Collect discounts by product ID
      try {
        //console.log("Store:", storedState);
  
        for (const product of storedState.products) {
          const response = await axios.get(
            `${API_HOST}/products/discounted-price/${product.id}`
          );
          //console.log(`Response for product ${product.id}:`, response.data);
  
          // Save the discount percentage in the object
          productDiscounts[product.id] = response.data.discountPercentage;
        }
  
        // Dispatch all updates in a single action
        dispatch({
          type: "UPDATE_DISCOUNT",
          payload: productDiscounts, // Pass the discount mapping
        });
  
      } catch (error) {
        console.error("Error fetching updated discounts:", error);
      }
    };
  
    if (storedState.products.length > 0 && !initialFetchDone.current) {
      fetchUpdatedDiscounts();
      initialFetchDone.current = true; // Prevent duplicate fetches
    }
  }, [storedState.products]);
  
  return [storedState, dispatch];
}