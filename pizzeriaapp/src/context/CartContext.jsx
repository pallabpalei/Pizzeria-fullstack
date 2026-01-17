import { createContext, useEffect, useState } from "react";
import { getCart } from "../services/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ if not logged in, cart count must be 0
      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await getCart();

      const totalCount = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalCount);
    } catch (err) {
      console.log(err);
      setCartCount(0);
    }
  };

  // ✅ refresh once when app loads
  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
