import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await signup(form);
      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
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

        <button style={{ width: "100%", padding: 10 }}>
          Create Account
        </button>
      </form>

      {/* ✅ Back to login option */}
      <p style={{ marginTop: 15, textAlign: "center" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            background: "transparent",
            border: "none",
            color: "blue",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
