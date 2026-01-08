import { createContext, useEffect, useState } from "react";
import { getCart } from "../services/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = async () => {
    const res = await getCart();
    const count = res.data.reduce((sum, i) => sum + i.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
