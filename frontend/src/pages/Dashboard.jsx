import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("User not logged in.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:4003/dashboard/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCourses(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError("Couldn't load dashboard info.");
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

   
    localStorage.removeItem("userEmail");

   
    localStorage.removeItem("authToken"); 

    alert("You have successfully logged out.");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard container py-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="fancy-heading">Your Dashboard</h2>
        <button style={{ minWidth: '160px' }} className="btn btn-danger" onClick={handleLogout}>Log Out</button>
      </div>
      {courses.length === 0 ? (
        <p className="text-center">You're not enrolled in any courses yet.</p>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <div key={course.courseNo} className="course-card">
              <h4 className="course-title">{course.courseName}</h4>
              <Link to={`/resources/${course.courseNo}`}>
                <button className="btn btn-primary btnDash">Go to Resources</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

