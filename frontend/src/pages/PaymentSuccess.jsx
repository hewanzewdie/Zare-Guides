// PaymentSuccess.js
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const txRef = queryParams.get("tx_ref");

    if (!txRef) {
      // Handle case where tx_ref is missing
      console.error("Transaction reference not found.");
      return;
    }

    // Process based on payment status
    if (status === "success") {
      // Redirect user or display success message
      alert(`Payment successful! Transaction Reference: ${txRef}`);
      navigate("/dashboard"); // or redirect to course content, etc.
    } else {
      // Handle failed payment
      alert(`Payment failed. Transaction Reference: ${txRef}`);
      navigate("/courses"); // Or take them to courses listing page
    }
  }, [location, navigate]);

  return <div>Processing Payment...</div>;
};

export default PaymentSuccess;
