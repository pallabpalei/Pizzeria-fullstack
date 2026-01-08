# 🍕 Pizzeria Full Stack Application

A complete **Full Stack Pizzeria Application** developed using **React**, **Node.js**, **Express**, and **MongoDB**.  
The application allows users to order pizzas, build custom pizzas, manage a shopping cart, and view total pricing dynamically.



## 📌 Project Features

### Frontend (React)
- Responsive UI built with React
- Navigation using React Router
- Pages:
  - Home
  - Order Pizza
  - Build Your Pizza
  - Shopping Cart
- Dynamic cart count badge in navbar
- Veg / Non-Veg indicators
- Quantity controls in cart
- Live total price calculation
- Global cart state using **React Context**

### Backend (Node + Express)
- RESTful API development
- MongoDB integration using Mongoose
- APIs for:
  - Fetching pizzas
  - Fetching ingredients
  - Adding items to cart
  - Updating cart item quantity
  - Deleting cart items
  - Fetching cart items

### Database (MongoDB)
- Database Name: `PIZZARIADB`
- Collections:
  - `pizzas`
  - `ingredients`
  - `carts`



## 🛠️ Technology Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React, Axios, React Router |
| Backend    | Node.js, Express.js |
| Database   | MongoDB |
| Styling    | CSS |
| State Mgmt | React Context API 