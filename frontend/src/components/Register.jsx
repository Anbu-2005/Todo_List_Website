import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "../Axios/axios.js";
import TokenContext from '../context/TokenContext.js';

function Register() {
  const [formData, setFormData] = useState({});
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("https://todo-list-website-backend-28iq.onrender.com/user/register", formData);
      tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
      userDispatch({ type: "SET_USER", payload: result.data.user });
      localStorage.setItem("authToken", JSON.stringify(result.data.token));
    } catch (error) {
      console.error(error);
      setError({ message: error.response?.data?.message || "Registration failed" });
    }
  };

  if (userToken) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Full Name", name: "name", type: "text" },
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
            Register
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center gap-2"
        >
          <img
            src="https://t4.ftcdn.net/jpg/03/91/79/25/360_F_391792593_BYfEk8FhvfNvXC5ERCw166qRFb8mYWya.jpg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Register;
