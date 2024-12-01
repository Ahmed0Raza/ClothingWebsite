import { useEffect, useReducer } from "react";
import api from "@/api";

export const initialCartState = {
  products: [],
  deliveryCharges: 250,
  total: 0
};

function getCartTotal(products) {
  return products.reduce((sum, p) => {
    const basePrice = p.price * p.quantity;
    const discountPercentage = p.discountPercentage || 0;
    const discountedPrice = basePrice - (basePrice * discountPercentage / 100);
    return sum + discountedPrice;
  }, 0);
}

export default function cartReducer(state, action) {
  let newProducts;

  switch(action.type) {
    case "RESET":
      return initialCartState;

      case "UPDATE_DISCOUNT": {
        //console.log("Action Payload:", action.payload); // Log the payload to check its structure
      
        const updatedProducts = state.products.map((product) => {
          const updatedDiscount = action.payload[product.id]; // Get discount from payload
          //console.log(`Product ID: ${product.id}, Updated Discount: ${updatedDiscount}`); // Log each product's discount
      
          if (updatedDiscount !== undefined) {
            //console.log(`Updating product ${product.id} with discount ${updatedDiscount}`); // Log when a discount is applied
            return {
              ...product,
              discountPercentage: updatedDiscount, // Update discount
            };
          }
          //console.log(`No update for product ${product.id}`); // Log when no discount is applied
          return product;
        });
      
        const updatedTotal = getCartTotal(updatedProducts); // Recalculate total
        //console.log("Updated Cart Total:", updatedTotal); // Log the recalculated total
      
        return {
          ...state,
          products: updatedProducts,
          total: updatedTotal,
        };
      }
          
      
    case "SET_PRODUCTS":
      const newStateWithProducts = {
        ...state,
        products: action.payload,
        total: getCartTotal(action.payload)
      };
      return newStateWithProducts;

    case "ADD_PRODUCTS":
      const existingProductIndex = state.products.findIndex(
        p => p.uniqueCartKey === action.payload[0].uniqueCartKey
      );

      if (existingProductIndex !== -1) {
        const updatedProducts = [...state.products];
        updatedProducts[existingProductIndex].quantity += action.payload[0].quantity;

        const updatedState = {
          ...state,
          products: updatedProducts,
          total: getCartTotal(updatedProducts)
        };
        return updatedState;
      } else {
        newProducts = [
          ...state.products,
          ...action.payload.map(product => ({
            id: product._id,
            title: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage || 0,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            quantity: product.quantity,
            color: product.color,
            size: product.size,
            uniqueCartKey: `${product._id}-${product.size}-${product.color}`,
          })),
        ];

        const newStateAfterAddition = {
          ...state,
          products: newProducts,
          total: getCartTotal(newProducts)
        };
        return newStateAfterAddition;
      }

    case "REMOVE_PRODUCT":
      newProducts = state.products.filter(p => p.uniqueCartKey !== action.payload);

      const newStateAfterRemoval = {
        ...state,
        products: newProducts,
        total: getCartTotal(newProducts)
      };
      return newStateAfterRemoval;

    case "SET_PRODUCT_QUANTITY":
      if (action.payload.quantity < 1) {
        return state;
      }
      newProducts = [...state.products];

      const productIdx = newProducts.findIndex(p => p.uniqueCartKey === action.payload.uniqueCartKey);
      
      if (productIdx !== -1) {
        newProducts[productIdx].quantity = action.payload.quantity;
      }

      const newStateAfterSetQuantity = {
        ...state,
        products: newProducts,
        total: getCartTotal(newProducts)
      };
      return newStateAfterSetQuantity;

    default:
      return state;
  }
}

export function useReducerWithLocalStorage(reducer, initialState, storageKey) {
  const [storedState, dispatch] = useReducer(reducer, initialState, (initialState) => {
    try {
      const persisted = window.localStorage.getItem(storageKey);
      return persisted ? JSON.parse(persisted) : initialState;
    } catch (error) {
      //console.log(error);
      return initialState;
    }
  });

  // Effect to update discount percentages when cart is loaded or changed
  useEffect(() => {
    const updateDiscounts = async () => {
      if (storedState.products && storedState.products.length > 0) {
        for (const product of storedState.products) {
          try {
            const response = await api.get(`/products/discounted-price/${product.id}`);
            if (response.data.discountPercentage !== product.discountPercentage) {
              dispatch({
                type: 'UPDATE_DISCOUNT',
                payload: {
                  productId: product.id,
                  discountPercentage: response.data.discountPercentage
                }
              });
            }
          } catch (error) {
            console.error(`Failed to update discount for product ${product.id}:`, error);
          }
        }
      }
    };

    updateDiscounts();
  }, [storedState.products]); // Update when products change

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storedState));
  }, [storedState, storageKey]);

  return [storedState, dispatch];
}