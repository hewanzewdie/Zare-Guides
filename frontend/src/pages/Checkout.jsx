import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';


const Checkout = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [courseDetails, setCourseDetails] = useState({});
  const [paymentVisited, setPaymentVisited] = useState(false); 

  useEffect(() => {
    
    fetch(`http://localhost:4003/courses/${id}`)
      .then(response => response.json())
      .then(data => {
        setCourseDetails(data);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
      });
  }, [id]);

  
  useEffect(() => {
    const savedPaymentStatus = localStorage.getItem('paymentVisited');
    if (savedPaymentStatus) {
      setPaymentVisited(true);  
    }
  }, []);

  const handlePayment = () => {
    
    localStorage.setItem('paymentVisited', true);
    

    window.location.href = "https://www.combanketh.et/";
  };

  const handleRedirectToResources = () => {
    
    navigate(`/resources/${id}`);
  };

  return (
    <div className="checkout-page">
      <h2 className="fancy-heading text-center">Checkout for {courseDetails.title}</h2>

     
      <div className="course-info">
        <img src={courseDetails.image} alt={courseDetails.title} />
        <h3>{courseDetails.title}</h3>
        <p>{courseDetails.description}</p>
        <p><strong>Price: {courseDetails.price}</strong></p>
      </div>

      
      {!paymentVisited ? (
        <button
          className="btn-dark-theme"
          onClick={handlePayment}
        >
          Pay with CBE
        </button>
      ) : (
        <button
          className="btn-dark-theme"
          onClick={handleRedirectToResources}
        >
          Get Resources
        </button>
      )}
    </div>
  );
};

export default Checkout;
