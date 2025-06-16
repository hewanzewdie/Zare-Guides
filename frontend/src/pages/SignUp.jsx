// SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import heroBg from "../assets/hero-bg.jpg";

const SignUp = () => {
  const [name, setName] = useState("");
  const [phoneno, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation patterns
    const namePattern = /^[A-Za-z\s]+$/;
    const phonePattern = /^[0-9]{10,15}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validations
    if (!namePattern.test(name)) {
      alert("Name can only contain letters and spaces.");
      return;
    }

    if (!phonePattern.test(phoneno)) {
      alert("Phone number must be between 10 and 15 digits.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 4) {
      alert("Password must be at least 4 characters long.");
      return;
    }

    const signUpData = { name, phoneno, email, password };

    try {
      const response = await fetch("http://localhost:4003/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Sign up successful!", data);
        alert("Signed up successfully!")
        if (data.user?.id) {
          localStorage.setItem("userId", data.user.id);
        }
        navigate("/courses");
      } else {
        console.error("Signup failed:", data.message);
        alert("Signup failed!")
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  return (
    <div className="login-hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="login-overlay"></div>
      <div className="login-box">
        <h2 className="fancy-heading">Sign Up</h2>
        <form className="login-form" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneno}
            required
            onChange={(e) => setPhone(e.target.value)}
          />
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
          <button type="submit">Sign Up</button>
        </form>
        <p className="redirect-text">
          Already have an account?{" "}
          <span onClick={goToLoginPage} className="redirect-link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

