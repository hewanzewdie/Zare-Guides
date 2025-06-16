import React from "react";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import "../styles/Home.css";
import hero2 from "../assets/hero-bg2.jpg";
import hero3 from "../assets/hero-bg3.jpg";
import hero4 from "../assets/hero-bg4.jpg";

const Home = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ooh2k8n",         // service ID
        "template_nwpg5le",        // template ID
        form.current,
        "iYS7eLBdtNRUwOIiO"        // public key
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
          form.current.reset();
        },
        (error) => {
          alert("Failed to send message, please try again.");
        }
      );
  };
  return (
    <div>

      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Startup Consultancy</h1>
          <p>Empowering entrepreneurs with expert guidance to create thriving businesses.</p>
          <div className="hero-buttons">
      <Link to="/courses" className="btn-dark-theme">Explore Courses</Link>
      <Link to="/login" className="btn-dark-theme">Sign Up</Link> 
    </div>
        </div>
      </section>


<section className="about dark-section">
  <h2 className="fancy-heading">Services</h2>
  
  <p className="about-text">
    At Startup Consultancy, we empower entrepreneurs with the right knowledge, strategies, and 
    resources to successfully build and scale their businesses.  
  </p>

  <p className="about-text">
    Our expert-led courses provide in-depth insights into key areas such as finance, marketing, 
    and business law, ensuring that our clients make informed decisions in every aspect of their ventures.  
  </p>

  <p className="about-text">
    Whether you're just starting out or looking to refine your strategies, we provide practical 
    solutions that turn your vision into a thriving business.  
  </p>


  <h4 className="fancy-heading">Our Courses</h4>
  <div className="courses-container">


    <div className="course-card">
      <img src={hero4} alt="Finance" className="course-img" />
      <div className="course-info">
        <h4>Finance</h4>
        <p>Master the fundamentals of financial management, including budgeting, cash flow 
        analysis, and investment strategies to keep your business financially strong.</p>
      </div>
    </div>


    <div className="course-card">
      <img src={hero2} alt="Marketing" className="course-img" />
      <div className="course-info">
        <h4>Marketing</h4>
        <p>Discover the best marketing practices, from brand positioning to social media advertising, 
        to attract and retain customers effectively.</p>
      </div>
    </div>

 
    <div className="course-card">
      <img src={hero3} alt="Business Law" className="course-img" />
      <div className="course-info">
        <h4>Business Law</h4>
        <p>Learn the legal essentials of running a business, including contract law, compliance, 
        intellectual property protection, and business regulations.</p>
      </div>
    </div>

  </div>
</section>
  
      <section className="contact dark-section">
        <h2 className="fancy-heading">Contact Us</h2>
        <div className="contact-container">
          
        <form className="contact-form" ref={form} onSubmit={sendEmail}>
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message" required rows="5"></textarea>
  <button type="submit">Send Message</button>
</form>

      
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="icons">
              <div className="icon-item">
                <FaFacebookF />
                <span>Facebook</span>
              </div>
              <div className="icon-item">
                <FaTwitter />
                <span>Twitter</span>
              </div>
              <div className="icon-item">
                <FaLinkedinIn />
                <span>LinkedIn</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
