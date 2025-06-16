import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readyForResources, setReadyForResources] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("User not logged in.");
      navigate("/login");
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:4003/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse({
          title: data.courseName,
          description: data.courseDes,
          image: data.courseImg ? `data:image/jpeg;base64,${data.courseImg}` : '',
          price: data.coursePrice ? `${data.coursePrice} ETB` : 'Price not available',
        });
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError("Unable to fetch course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const storedReady = localStorage.getItem('readyForResources');
    if (storedReady === id) {
      setReadyForResources(true);
    }
  }, [id]);

  const handleButtonClick = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('User email not found. Please log in again.');
      return;
    }
  
    if (readyForResources) {
      navigate(`/courseResources/${id}`);
    } else {
      try {
        // Call the enroll API
        const response = await fetch('http://localhost:4003/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, courseId: id }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          localStorage.setItem('readyForResources', id);
          window.location.href = 'https://www.combanketh.et'; // Redirect to payment
        } else {
          alert('Enrollment failed: ' + result.message);
        }
      } catch (err) {
        console.error('Error during enrollment:', err);
        alert('Something went wrong while enrolling.');
      }
    }
  };
  

  if (loading) {
    return <div className="container py-5">Loading...</div>;
  }

  if (error) {
    return <div className="container py-5">{error}</div>;
  }

  return (
    <div className="container py-5">
      {course && (
        <>
          <h2 className="fancy-heading">{course.title}</h2>
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              style={{ maxWidth: '80%', height: 'auto', marginBottom: '20px' }}
            />
          )}
          <p>{course.description}</p>
          <p><strong>Price: {course.price}</strong></p>
          <button onClick={handleButtonClick} className="btn btn-dark-theme">
            {readyForResources ? 'Get Resources' : 'Enroll'}
          </button>
        </>
      )}
    </div>
  );
};

export default CourseDetails;





