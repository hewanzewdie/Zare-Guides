import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import heroBg from "../assets/hero-bg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    
    if (email && password) {
      try {
        
        const response = await fetch("http://localhost:4003/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("Login successful:", data.user);
          localStorage.setItem("userEmail", data.user.email);
          navigate("/dashboard"); 
          console.log(localStorage.getItem('userEmail'));
        } else {
          alert(data.error || "Login failed.");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please enter both email and password.");
    }
  };

  const goToSignUpPage = () => {
   
    navigate("/signup");
  };

  return (
    <div className="login-hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="login-overlay"></div>
      <div className="login-box">
        <h2 className="fancy-heading">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <p className="redirect-text">
          Don't have an account?{" "}
          <span onClick={goToSignUpPage} className="redirect-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
