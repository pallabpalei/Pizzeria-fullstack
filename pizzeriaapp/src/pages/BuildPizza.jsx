import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getIngredients, addToCart } from "../services/api";
import { CartContext } from "../context/CartContext";
import "./BuildPizza.css";

function BuildPizza() {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ IMPORTANT: refreshCart for navbar badge update
  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    getIngredients().then((res) => setIngredients(res.data));
  }, []);

  const toggleIngredient = (item, checked) => {
    if (checked) {
      setSelected((prev) => [...prev, item]);
      setTotal((prev) => prev + Number(item.price));
    } else {
      setSelected((prev) => prev.filter((i) => i.id !== item.id));
      setTotal((prev) => prev - Number(item.price));
    }
  };

  const buildPizza = async () => {
    if (!token) {
      alert("Please login to add custom pizza to cart");
      navigate("/login");
      return;
    }

    if (selected.length === 0) {
      alert("Please select at least one ingredient");
      return;
    }

    try {
      await addToCart({
        itemId: "CUSTOM",
        name: "Custom Pizza",
        price: total,
        basePrice: total,
        extraToppingCost: 0,
        quantity: 1,
        type: "custom",
        isCustom: true,
        selectedIngredients: selected.map((x) => x.tname),
        selectedToppings: []
      });

      // ✅ instantly update navbar badge
      await refreshCart();

      alert("Custom pizza added to cart ✅");
      setSelected([]);
      setTotal(0);
    } catch (err) {
      console.log(err);
      alert("Failed to add custom pizza");
    }
  };

  return (
    <div className="build-container">
      <p className="build-note">
        Pizzeria now gives you options to build your own pizza.
        Customize your pizza by choosing ingredients from the list given below
      </p>

      <table className="build-table">
        <tbody>
          {ingredients.map((item) => (
            <tr key={item.id}>
              <td>
                <img src={item.image} alt={item.tname} />
              </td>
              <td className="name">{item.tname}</td>
              <td className="price">₹{item.price}.00</td>
              <td className="add">
                <input
                  type="checkbox"
                  checked={selected.some((i) => i.id === item.id)}
                  onChange={(e) => toggleIngredient(item, e.target.checked)}
                />
                <span>Add</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="total">Total Cost : {total}</h3>

      <button className="build-btn" onClick={buildPizza}>
        Build Ur Pizza
      </button>
    </div>
  );
}

export default BuildPizza;
