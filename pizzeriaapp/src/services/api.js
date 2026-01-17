import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

// ✅ automatically attach token for every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

// ✅ Pizza APIs
export const getPizzas = () => API.get("/pizzas");
export const getIngredients = () => API.get("/ingredients");
export const getToppings = () => API.get("/toppings");

// ✅ Cart APIs (now protected)
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const updateCart = (id, data) => API.put(`/cart/${id}`, data);
export const deleteCart = (id) => API.delete(`/cart/${id}`);

// ✅ Auth APIs
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
