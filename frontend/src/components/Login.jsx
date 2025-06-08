import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "../Axios/axios.js";
import TokenContext from "../context/TokenContext.js";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [formData, setFormData] = useState({});
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState(null);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Email/password form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/user/register", formData);

      tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
      userDispatch({ type: "SET_USER", payload: result.data.user });
      localStorage.setItem("authToken", JSON.stringify(result.data.token));
      setError(null);
    } catch (error) {
      console.error(error);
      setError({ message: error.response?.data?.message || "Login failed" });
    }
  };

  // Google login success handler
const handleGoogleLoginSuccess = async (credentialResponse) => {
  try {
    // Send Google token to backend for verification and app JWT
    const response = await axios.post("/user/googleLogin", {
      token: credentialResponse.credential,
    });

    userDispatch({ type: "SET_USER", payload: response.data.user });
    tokenDispatch({ type: "SET_TOKEN", payload: response.data.token });
    localStorage.setItem("authToken", JSON.stringify(response.data.token));
    setError(null);
  } catch (err) {
    console.error("Google login failed", err);
    setError({ message: "Google login failed" });
  }
};


  const handleGoogleLoginError = () => {
    setError({ message: "Google login failed" });
  };

  // If user already logged in, redirect to homepage
  if (userToken) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error.message}
          </div>
        )}

        {/* Email/password login form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-6">
          {[
            { label: "Email Address", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
          ].map(({ label, name, type }) => (
            <div key={name} className="relative pt-4">
              <input
                id={name}
                name={name}
                type={type}
                placeholder=" "
                required
                onChange={handleChange}
                className="peer w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-gray-900 placeholder-transparent
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <label
                htmlFor={name}
                className="absolute left-4 top-5 text-gray-500 text-sm 
                           peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 
                           peer-focus:top-2 peer-focus:text-indigo-600 peer-focus:text-xs
                           bg-white px-1 pointer-events-none transition-all"
              >
                {label}
              </label>
            </div>
          ))}

         

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="text-center mb-4 text-gray-400">OR</div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
