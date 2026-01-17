import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCart,
  deleteCart,
  addToCart,
  getPizzas,
  getToppings
} from "../services/api";
import { CartContext } from "../context/CartContext";

function Cart() {
  const [items, setItems] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [toppingsMaster, setToppingsMaster] = useState([]);

  // customize modal states
  const [editingItem, setEditingItem] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

  const { refreshCart } = useContext(CartContext);
  const navigate = useNavigate();

  const loadAll = useCallback(async () => {
    try {
      const cartRes = await getCart();
      const pizzaRes = await getPizzas();
      const topRes = await getToppings();

      setItems(cartRes.data);
      setPizzas(pizzaRes.data);
      setToppingsMaster(topRes.data);

      await refreshCart();
    } catch (err) {
      console.log(err);
    }
  }, [refreshCart]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view cart");
      navigate("/login");
      return;
    }
    loadAll();
  }, [loadAll, navigate]);

  const getBasePizza = (item) =>
    pizzas.find((p) => String(p.id) === String(item.itemId));

  const getToppingPrice = (tname) => {
    const t = toppingsMaster.find((x) => x.tname === tname);
    return t ? Number(t.price) : 0;
  };

  const computeToppingsTotal = (chosen) => {
    return (chosen || []).reduce((sum, t) => sum + getToppingPrice(t), 0);
  };

  const remove = async (id) => {
    await deleteCart(id);
    await refreshCart();
    await loadAll();
  };

  const increase = async (item) => {
    // ✅ customized pizza => separate row, not increase qty
    if (item.isCustom === true) {
      await addToCart({
        itemId: item.itemId,
        name: item.name,
        type: item.type,
        quantity: 1,
        isCustom: true,
        selectedToppings: item.selectedToppings || [],
        basePrice: Number(item.basePrice || item.price),
        extraToppingCost: Number(item.extraToppingCost || 0),
        price: Number(item.price)
      });
    } else {
      await updateCart(item._id, { quantity: item.quantity + 1 });
    }

    await refreshCart();
    await loadAll();
  };

  const decrease = async (item) => {
    if (item.quantity <= 1) return;
    await updateCart(item._id, { quantity: item.quantity - 1 });

    await refreshCart();
    await loadAll();
  };

  // ✅ open customizer for an existing cart item
  const openCustomizer = (item) => {
    const basePizza = getBasePizza(item);

    // base price always from pizza DB, fallback to saved basePrice
    const basePrice = basePizza
      ? Number(basePizza.price)
      : Number(item.basePrice || 0);

    setEditingItem({
      ...item,
      basePrice
    });

    const chosen = item.selectedToppings || [];
    setSelectedToppings([...chosen]);

    const toppingsTotal = computeToppingsTotal(chosen);
    setFinalPrice(basePrice + toppingsTotal);
  };

  const toggleTopping = (tname) => {
    if (!editingItem) return;

    setSelectedToppings((prev) => {
      let updated;

      if (prev.includes(tname)) {
        updated = prev.filter((x) => x !== tname);
      } else {
        updated = [...prev, tname];
      }

      const toppingsTotal = computeToppingsTotal(updated);
      const basePrice = Number(editingItem.basePrice || 0);
      setFinalPrice(basePrice + toppingsTotal);

      return updated;
    });
  };

  // ✅ save customization back to DB
  const saveCustomization = async () => {
    if (!editingItem) return;

    try {
      const basePizza = getBasePizza(editingItem);
      const basePrice = basePizza
        ? Number(basePizza.price)
        : Number(editingItem.basePrice || 0);

      const toppingsTotal = computeToppingsTotal(selectedToppings);
      const final = basePrice + toppingsTotal;

      await updateCart(editingItem._id, {
        isCustom: true,
        selectedToppings,
        basePrice,
        extraToppingCost: toppingsTotal, // ✅ only ADD cost
        price: final
      });

      alert("Customization saved ✅");

      setEditingItem(null);
      setSelectedToppings([]);
      setFinalPrice(0);

      await refreshCart();
      await loadAll();
    } catch (err) {
      console.log(err);
      alert("Failed to save customization");
    }
  };

  const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

  if (items.length === 0) {
    return <h2 style={{ padding: 20 }}>🛒 Your cart is empty</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Shopping Cart</h2>

      {items.map((i) => {
        const basePizza = getBasePizza(i);
        const basePrice = basePizza
          ? Number(basePizza.price)
          : Number(i.basePrice || 0);

        const chosen = i.selectedToppings || [];
        const toppingsTotal = Number(i.extraToppingCost || computeToppingsTotal(chosen));

        return (
          <div
            key={i._id}
            style={{
              background: "white",
              padding: 15,
              marginBottom: 12,
              borderRadius: 8,
              boxShadow: "0 0 10px rgba(0,0,0,0.08)"
            }}
          >
            <h3 style={{ marginBottom: 4 }}>
              {i.name}{" "}
              {i.isCustom ? (
                <span style={{ fontSize: 13, color: "purple" }}>(Custom)</span>
              ) : null}
            </h3>

            {/* ✅ show chosen toppings only */}
            {chosen.length > 0 ? (
              <div style={{ fontSize: 13, marginTop: 6 }}>
                <b>Selected Toppings:</b>
                <ul style={{ marginTop: 6, marginBottom: 6 }}>
                  {chosen.map((t) => (
                    <li key={t}>
                      {t} (+₹{getToppingPrice(t)})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ fontSize: 13, marginTop: 6, color: "gray" }}>
                No extra toppings selected
              </p>
            )}

            {/* ✅ price breakdown */}
            <div style={{ marginTop: 8, fontSize: 13 }}>
              <div>
                <b>Base Price:</b> ₹{basePrice}
              </div>

              <div>
                <b>Toppings Price:</b>{" "}
                <span style={{ color: "green" }}>+₹{toppingsTotal}</span>
              </div>

              <div style={{ marginTop: 4, fontSize: 16 }}>
                <b>Final Price:</b> ₹{i.price}
              </div>
            </div>

            {/* qty controls */}
            <div style={{ marginTop: 12 }}>
              <button onClick={() => decrease(i)}>-</button>
              <span style={{ margin: "0 10px" }}>{i.quantity}</span>
              <button onClick={() => increase(i)}>+</button>

              <button onClick={() => remove(i._id)} style={{ marginLeft: 15 }}>
                Remove
              </button>

              <button onClick={() => openCustomizer(i)} style={{ marginLeft: 15 }}>
                Customize
              </button>
            </div>
          </div>
        );
      })}

      <h2 style={{ textAlign: "right" }}>Total: ₹{total}</h2>

      {/* ✅ Customize Modal */}
      {editingItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div style={{ width: 520, background: "white", borderRadius: 10, padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Customize Cart Item (Toppings)</h2>

            <p style={{ marginBottom: 10 }}>
              <b>{editingItem.name}</b> <br />
              Base Price: ₹{editingItem.basePrice} <br />
              Final Price: ₹{finalPrice}
            </p>

            {/* ✅ Show ALL toppings based on pizza type */}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                maxHeight: 250,
                overflowY: "auto"
              }}
            >
              {(() => {
                const basePizza = getBasePizza(editingItem);

                // if base pizza not found fallback all toppings
                if (!basePizza) return toppingsMaster;

                // veg pizza -> only veg toppings
                if (basePizza.type === "veg") {
                  return toppingsMaster.filter((t) => t.category === "veg");
                }

                // nonveg pizza -> all toppings
                return toppingsMaster;
              })().map((t) => (
                <label
                  key={t.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 6px",
                    borderBottom: "1px solid #f2f2f2"
                  }}
                >
                  <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedToppings.includes(t.tname)}
                      onChange={() => toggleTopping(t.tname)}
                    />
                    {t.tname}
                    {t.category && (
                      <small
                        style={{
                          marginLeft: 8,
                          color: t.category === "veg" ? "green" : "red",
                          fontWeight: "bold"
                        }}
                      >
                        ({t.category})
                      </small>
                    )}
                  </span>

                  <b>+₹{t.price}</b>
                </label>
              ))}
            </div>

            <div style={{ marginTop: 15, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setSelectedToppings([]);
                  setFinalPrice(0);
                }}
              >
                Cancel
              </button>

              <button onClick={saveCustomization}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
