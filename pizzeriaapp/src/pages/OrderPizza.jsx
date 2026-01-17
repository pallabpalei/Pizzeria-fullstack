import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPizzas,
  addToCart,
  updateCart,
  getCart,
  getToppings
} from "../services/api";
import { CartContext } from "../context/CartContext";

function OrderPizza() {
  const [pizzas, setPizzas] = useState([]);
  const [cart, setCart] = useState([]);
  const [toppingsMaster, setToppingsMaster] = useState([]);

  // customize modal states
  const [showCustomize, setShowCustomize] = useState(false);
  const [activePizza, setActivePizza] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { refreshCart } = useContext(CartContext);

  const loadData = useCallback(async () => {
    try {
      const p = await getPizzas();
      setPizzas(p.data);

      if (token) {
        const c = await getCart();
        setCart(c.data);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const loadToppings = useCallback(async () => {
    try {
      const res = await getToppings();
      setToppingsMaster(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadToppings();
  }, [loadData, loadToppings]);

  // ✅ topping price by name
  const toppingPrice = (tname) => {
    const t = toppingsMaster.find((x) => x.tname === tname);
    return t ? Number(t.price) : 0;
  };

  // ✅ allow veg toppings only for veg pizza
  // ✅ allow both veg + nonveg for nonveg pizza
  const getAllowedToppingsByPizzaType = () => {
    if (!activePizza) return [];

    // if toppingsMaster doesn't have category, fallback: show all
    const hasCategory = toppingsMaster.some((t) => t.category);

    if (!hasCategory) return toppingsMaster;

    if (activePizza.type === "veg") {
      return toppingsMaster.filter((t) => t.category === "veg");
    }

    // nonveg pizza -> show all toppings
    return toppingsMaster;
  };

  // ✅ Price = base price + selected toppings total (only addition)
  const calcCustomizedPrice = () => {
    if (!activePizza) return 0;

    const basePrice = Number(activePizza.price);
    const toppingsTotal = selectedToppings.reduce(
      (sum, t) => sum + toppingPrice(t),
      0
    );

    return basePrice + toppingsTotal;
  };

  const openCustomize = (pizza) => {
    if (!token) {
      alert("Please login to customize pizza");
      navigate("/login");
      return;
    }

    setActivePizza(pizza);

    // ✅ now we start empty selection (no default toppings)
    setSelectedToppings([]);

    setShowCustomize(true);
  };

  const toggleTopping = (tname) => {
    setSelectedToppings((prev) => {
      if (prev.includes(tname)) return prev.filter((x) => x !== tname);
      return [...prev, tname];
    });
  };

  // ✅ normal add to cart
  const addNormalPizza = async (pizza) => {
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      // normal pizza can be increased in quantity
      const existing = cart.find(
        (i) => String(i.itemId) === String(pizza.id) && i.isCustom !== true
      );

      if (existing) {
        await updateCart(existing._id, { quantity: existing.quantity + 1 });
      } else {
        await addToCart({
          itemId: pizza.id,
          name: pizza.name,
          type: pizza.type,
          quantity: 1,

          isCustom: false,
          basePrice: Number(pizza.price),
          extraToppingCost: 0,
          price: Number(pizza.price),
          selectedToppings: []
        });
      }

      await refreshCart();
      await loadData();
    } catch (err) {
      console.log(err);
      alert("Failed to add pizza");
    }
  };

  // ✅ customized add to cart
  const addCustomizedPizza = async () => {
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (!activePizza) return;

    try {
      const basePrice = Number(activePizza.price);

      const toppingsTotal = selectedToppings.reduce(
        (sum, t) => sum + toppingPrice(t),
        0
      );

      const finalPrice = basePrice + toppingsTotal;

      await addToCart({
        itemId: activePizza.id,
        name: `${activePizza.name} (Customized)`,
        type: activePizza.type,
        quantity: 1,

        isCustom: true,
        basePrice: basePrice,
        extraToppingCost: toppingsTotal,
        price: finalPrice,
        selectedToppings: selectedToppings
      });

      alert("Customized pizza added to cart ✅");

      setShowCustomize(false);
      setActivePizza(null);
      setSelectedToppings([]);

      await refreshCart();
      await loadData();
    } catch (err) {
      console.log(err);
      alert("Failed to add customized pizza");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Order Pizza</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {pizzas.map((p) => (
          <div
            key={p.id}
            style={{
              width: 320,
              background: "white",
              padding: 15,
              borderRadius: 8,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              width="100%"
              height="180"
              style={{ objectFit: "cover", borderRadius: 6 }}
            />

            <h3 style={{ marginTop: 10 }}>
              {p.name}
              <span
                style={{
                  marginLeft: 10,
                  color: p.type === "veg" ? "green" : "red",
                  fontSize: 18
                }}
              >
                ●
              </span>
            </h3>

            <p style={{ fontSize: 14 }}>{p.description}</p>

            <p style={{ marginBottom: 6 }}>
              <b>₹{p.price}</b>
            </p>

            {/* ✅ No toppings shown on card */}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => addNormalPizza(p)}>Add to Cart</button>
              {token && <button onClick={() => openCustomize(p)}>Customize</button>}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Customize Modal */}
      {showCustomize && activePizza && (
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
          <div
            style={{
              width: 520,
              background: "white",
              borderRadius: 10,
              padding: 20
            }}
          >
            <h2 style={{ marginTop: 0 }}>Customize Pizza</h2>
            <h3 style={{ marginBottom: 10 }}>{activePizza.name}</h3>

            <p style={{ marginBottom: 8 }}>
              Select toppings (
              {activePizza.type === "veg"
                ? "Veg toppings only"
                : "Veg + Non-Veg toppings"}
              ):
            </p>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                maxHeight: 250,
                overflowY: "auto"
              }}
            >
              {getAllowedToppingsByPizzaType().map((t) => (
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
                    {/* optional badge */}
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

            <h3 style={{ marginTop: 12 }}>
              Final Price: ₹{calcCustomizedPrice()}
            </h3>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => {
                  setShowCustomize(false);
                  setActivePizza(null);
                  setSelectedToppings([]);
                }}
              >
                Cancel
              </button>

              <button onClick={addCustomizedPizza}>
                Add Customized Pizza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPizza;
