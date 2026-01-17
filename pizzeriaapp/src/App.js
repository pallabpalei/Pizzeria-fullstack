import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import OrderPizza from "./pages/OrderPizza";
import BuildPizza from "./pages/BuildPizza";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AuthRedirect from "./components/AuthRedirect";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<OrderPizza />} />
        <Route path="/build" element={<BuildPizza />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/login"
  element={
    <AuthRedirect>
      <Login />
    </AuthRedirect>
  }
/>

<Route
  path="/signup"
  element={
    <AuthRedirect>
      <Signup />
    </AuthRedirect>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
