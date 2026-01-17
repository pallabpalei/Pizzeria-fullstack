import { Navigate } from "react-router-dom";

function AuthRedirect({ children }) {
  const token = localStorage.getItem("token");

  // ✅ if already logged in -> redirect home
  if (token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AuthRedirect;
