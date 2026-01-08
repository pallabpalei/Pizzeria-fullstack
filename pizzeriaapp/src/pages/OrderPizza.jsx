import { useEffect, useState, useContext } from "react";
import { getPizzas, addToCart, updateCart, getCart } from "../services/api";
import { CartContext } from "../context/CartContext";

function OrderPizza() {
  const [pizzas, setPizzas] = useState([]);
  const [cart, setCart] = useState([]);

  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await getPizzas();
    const c = await getCart();
    setPizzas(p.data);
    setCart(c.data);
  };

  const addItem = async (pizza) => {
    const existing = cart.find(i => i.itemId === pizza.id);

    if (existing) {
      await updateCart(existing._id, {
        quantity: existing.quantity + 1
      });
    } else {
      await addToCart({
        itemId: pizza.id,
        name: pizza.name,
        price: pizza.price,
        quantity: 1,
        type: pizza.type
      });
    }

    await loadData();   // refresh order page cart logic
    refreshCart();      // 🔥 refresh navbar count
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Order Pizza</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {pizzas.map(p => (
          <div
            key={p.id}
            style={{
              width: 300,
              background: "white",
              padding: 15,
              borderRadius: 8,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            <img src={p.image} alt={p.name} width="100%" height="180" />
            <h3>
              {p.name}
              <span
                style={{
                  marginLeft: 10,
                  color: p.type === "veg" ? "green" : "red"
                }}
              >
                ●
              </span>
            </h3>
            <p>{p.description}</p>
            <p><b>₹{p.price}</b></p>
            <button onClick={() => addItem(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPizza;
