import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";
import userIcon from "../assets/User.jpg";

function Navbar() {
  const { cartCount, refreshCart } = useContext(CartContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    setOpenMenu(false);

    // ✅ Refresh cart badge instantly
    await refreshCart();

    navigate("/");
  };

  // ✅ Cart protected
  const openCart = () => {
    const tokenNow = localStorage.getItem("token");
    if (!tokenNow) {
      alert("Please login to view cart");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <span className="brand-text">Pizzeria</span>
          <img src={logo} alt="logo" className="logo" />
        </Link>

        <Link className="nav-link" to="/order">
          Order Pizza
        </Link>
        <Link className="nav-link" to="/build">
          Build Ur Pizza
        </Link>
      </div>

      <div className="nav-right">
        {/* ✅ User icon dropdown */}
        <div className="user-menu" ref={menuRef}>
          <button
            className="user-icon-btn"
            onClick={() => setOpenMenu((p) => !p)}
          >
            <img src={userIcon} alt="user" className="user-icon" />
          </button>

          {openMenu && (
            <div className="dropdown">
              {!token ? (
                <>
                  {/* ✅ ONLY LOGIN in navbar */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-user">
                    Hi, <b>{user?.name || "User"}</b>
                  </div>

                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ✅ Cart (Protected) */}
        <button className="cart-btn" onClick={openCart}>
          🛒 Shopping cart ({cartCount})
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
