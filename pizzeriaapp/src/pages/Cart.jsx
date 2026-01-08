import { useEffect, useState, useContext } from "react";
import { getCart, updateCart, deleteCart } from "../services/api";
import { CartContext } from "../context/CartContext";

function Cart() {
  const [items, setItems] = useState([]);
  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const res = await getCart();
    setItems(res.data);
  };

  const changeQty = async (id, qty) => {
    if (qty < 1) return;

    await updateCart(id, { quantity: qty });
    await loadCart();
    refreshCart(); // 🔥 update navbar count
  };

  const remove = async (id) => {
    await deleteCart(id);
    await loadCart();
    refreshCart(); // 🔥 update navbar count
  };

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return <h2 style={{ padding: 20 }}>🛒 Your cart is empty</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Shopping Cart</h2>

      {items.map(i => (
        <div
          key={i._id}
          style={{
            background: "white",
            padding: 15,
            marginBottom: 10,
            borderRadius: 6
          }}
        >
          <h4>{i.name}</h4>
          <p>₹{i.price}</p>

          <button onClick={() => changeQty(i._id, i.quantity - 1)}>
            -
          </button>

          <span style={{ margin: "0 10px" }}>
            {i.quantity}
          </span>

          <button onClick={() => changeQty(i._id, i.quantity + 1)}>
            +
          </button>

          <button
            onClick={() => remove(i._id)}
            style={{ marginLeft: 20 }}
          >
            Remove
          </button>
        </div>
      ))}

      <h2 style={{ textAlign: "right" }}>
        Total: ₹{total}
      </h2>
    </div>
  );
}

export default Cart;
