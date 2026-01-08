import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const { cartCount } = useContext(CartContext);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <img src={logo} alt="logo" className="logo" />
          <span className="brand-text">Pizzeria</span>
        </Link>

        <Link to="/order">Order Pizza</Link>
        <Link to="/build">Build Ur Pizza</Link>
      </div>

      <Link to="/cart" className="cart-btn">
        🛒 Shopping cart ({cartCount})
      </Link>
    </nav>
  );
}

export default Navbar;
