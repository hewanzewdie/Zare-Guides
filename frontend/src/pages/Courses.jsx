import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:4003/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error("Failed to fetch courses:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fancy-heading">Our Courses</h2>
      <div className="row mt-4">
        {courses.map(course => (
          <div className="col-md-4" key={course.courseNo}>
            <div className="card bg-dark text-white mb-4">
              <img 
                src={`data:image/jpeg;base64,${course.courseImg}`} 
                className="card-img-top" 
                alt={course.courseName} 
              />
              <div className="card-body">
                <h5 className="card-title">{course.courseName}</h5>
                <p className="card-text">{course.courseDes}</p>
                <Link to={`/courses/${course.courseNo}`} className="btn btn-dark-theme">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
