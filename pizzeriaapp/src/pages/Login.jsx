import { useState, useContext } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Login() {
  const [form, setForm] = useState({
    login: "", // email OR mobile
    password: ""
  });

  const navigate = useNavigate();
  const { refreshCart } = useContext(CartContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      // ✅ Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Update navbar cart badge instantly
      await refreshCart();

      alert(res.data.message || "Login successful");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
      <h2>Sign In</h2>

      <form onSubmit={handleLogin}>
        <input
          name="login"
          placeholder="Email or Mobile"
          value={form.login}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button style={{ width: "100%", padding: 10 }}>Login</button>
      </form>

      {/* ✅ Only inside login page signup option */}
      <p style={{ marginTop: 15, textAlign: "center" }}>
        New user?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          style={{
            background: "transparent",
            border: "none",
            color: "blue",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default Login;
