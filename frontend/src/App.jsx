import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import CourseResources from "./pages/CourseResources";
import Consultation from "./pages/Consultation";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
        <Navbar />
        <div className="container flex-grow-1 text-center py-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/resources/:id" element={<CourseResources />} />
            <Route path="/courseResources/:id" element={<CourseResources />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/consultation/:roomId" element={<Consultation />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
