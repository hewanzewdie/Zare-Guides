import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from "@emailjs/browser"; 
import { useNavigate } from "react-router-dom";


const CourseResources = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
     
      alert("You are not logged in.");
      navigate("/login"); 
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:4003/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        } else {
          console.error("Failed to fetch course details:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  if (!course) return <p>Loading...</p>;

  const getEmbedLink = (driveLink) => {
    if (!driveLink.includes("drive.google.com")) return driveLink;
    const fileIdMatch = driveLink.match(/\/d\/(.*?)(\/|$)/);
    return fileIdMatch
      ? `https://drive.google.com/file/d/${fileIdMatch[1]}/preview?rm=minimal`
      : driveLink;
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("userEmail");
  
    if (!userEmail) {
      alert("User not logged in.");
      return;
    }
  
    const userName = userEmail.split('@')[0]; // just an idea: use part before @ as a "name"
  
    const templateParams = {
      name: userName,
      time: new Date().toLocaleString(),
      message: feedback,
    };
  
    emailjs.send(
      "service_amylk6m",     // service ID
      "template_ggjvg0o",    // template ID
      templateParams,
      "k1D0YB_RMpI4eZFAL"    // public key
    )
    .then((response) => {
      console.log("SUCCESS!", response.status, response.text);
      alert("Feedback sent successfully!");
      setFeedback(""); 
    })
    .catch((error) => {
      console.error("FAILED...", error);
      alert("Error sending feedback.");
    });
  };
  
  return (
    <div className="container py-5">
      <h2 className="fancy-heading">{course.courseName} Resources</h2>
      <p>Here are your course materials:</p>

      <div className="resource-list">
        {course.courseDoc ? (
          <div className="resource-item mb-5" style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "8px",
          }}>
            <h4> Course Document</h4>
            <iframe
              src={getEmbedLink(course.courseDoc)}
              title="Course Document"
              width="100%"
              height="600px"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>No document available for this course.</p>
        )}

        {course.courseVideo ? (
          <div className="resource-item mb-5" style={{
            backgroundColor: "#1e1e1e",
            padding: "20px",
            borderRadius: "8px",
          }}>
            <h4>Course Video</h4>
            <iframe
              src={getEmbedLink(course.courseVideo)}
              title="Course Video"
              width="100%"
              height="500px"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p>No video available for this course.</p>
        )}
      </div>

      <div className="feedback-form mt-5">
        <h4 style={{ color: "#1e1e1e" }}>Send Feedback</h4>
        <form onSubmit={handleFeedbackSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            rows="5"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#1e1e1e",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ffd700",
              color: "white",
              cursor: "pointer",
            }}
          >
            Send Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseResources;


