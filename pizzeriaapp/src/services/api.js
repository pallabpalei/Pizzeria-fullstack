import axios from "axios";

const API = axios.create({
  baseURL: "/api"
});

export const getPizzas = () => API.get("/pizzas");
export const getIngredients = () => API.get("/ingredients");
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const updateCart = (id, data) => API.put(`/cart/${id}`, data);
export const deleteCart = (id) => API.delete(`/cart/${id}`);
