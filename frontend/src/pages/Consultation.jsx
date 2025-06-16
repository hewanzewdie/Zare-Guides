import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import emailjs from "@emailjs/browser"; 
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import "../styles/Consultation.css";
import { useParams } from 'react-router-dom';
 




function randomID(len = 5) {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const Consultation = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const callContainerRef = useRef(null);
  const [fieldReadyToJoin, setFieldReadyToJoin] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [courses, setCourses] = useState([]);
  const roomID = useRef(randomID());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();
  
  useEffect(() => {
    console.log("ROOM ID from URL:", roomId);
    console.log("Ref loaded:", callContainerRef.current);
  }, [roomId]);


  useEffect(() => {
    const savedField = localStorage.getItem('readyToJoin');
    if (savedField) {
      setFieldReadyToJoin(savedField);
    }
  }, []);



const handleClick = async (courseId) => {
  if (fieldReadyToJoin === courseId) {
    const appID = 1617893209;
    const serverSecret = '4d0a085d5c9aacf9f63bbd900706111d';
    const userName = randomID();
    const userId = randomID();
    const roomId = roomID.current;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      userName
    );

    const meetingLink = `${window.location.origin}/consultation/${roomId}`;
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      const templateParams = {
        name: "Consultation Meeting Invite",
        time: new Date().toLocaleString(),
        message: `Please join the video consultation using this link: ${meetingLink}`,
      };

      try {
        const emailResponse = await emailjs.send(
          "service_ooh2k8n",        // your service ID
          "template_dkckd0g",           // your template ID
          templateParams,
          "iYS7eLBdtNRUwOIiO"        // your public key
        );
        console.log("Meeting invite sent!", emailResponse.status, emailResponse.text);
      } catch (error) {
        console.error("Failed to send meeting invite:", error);
      }
    } else {
      console.error("No user email found in localStorage");
    }

    // Now join the room
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: callContainerRef.current,
      sharedLinks: [{
        name: 'Personal link',
        url: meetingLink,
      }],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      showScreenSharingButton: true,
    });

    setIsInCall(true);

  } else {
    localStorage.setItem('readyToJoin', courseId);
    window.location.href = "https://www.combanketh.et/";
  }
};

  

  useEffect(() => {
    fetch('http://localhost:4003/consultation')
      .then(response => response.json())
      .then(data => {
        const processedCourses = data.map(course => ({
          id: course.courseNo.toString(),
          title: course.courseName,
          description: course.courseDes,
          image: course.courseImg ? `data:image/jpeg;base64,${course.courseImg}` : '',
          price: course.courseConsPrice ? `${course.courseConsPrice} ETB` : 'Price not available'
        }));
        setCourses(processedCourses);
      })
      .catch(error => {
        console.error('Error fetching consultation courses:', error);
      });
  }, []);

  useEffect(() => {
    if (roomId) {
      const appID = 1617893209;
      const serverSecret = '4d0a085d5c9aacf9f63bbd900706111d';
      const userName = randomID();
      const userId = randomID();
  
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userId,
        userName
      );
  
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: callContainerRef.current,
        sharedLinks: [{
          name: 'Personal link',
          url: window.location.href,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
      });
  
      setIsInCall(true);
    }
  }, [roomId]);
  

 /* const handleClick = async (courseId) => {
    if (fieldReadyToJoin === courseId) {
      // User is ready, join the call
      const appID = 1617893209;
      const serverSecret = '4d0a085d5c9aacf9f63bbd900706111d';
      const roomId = roomID.current;
      const userName = randomID();
      const userId = randomID();

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userId,
        userName
      );

      const meetingLink = `${window.location.origin}/consultation/${roomId}`;

      try {
        const response = await fetch('http://localhost:4003/send-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            courseId: courseId,
            meetingLink: meetingLink
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send invite email');
        }

        console.log('Invite email sent successfully');
      } catch (error) {
        console.error('Error sending invite email:', error);
      }

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: callContainerRef.current,
        sharedLinks: [{
          name: 'Personal link',
          url: meetingLink
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showScreenSharingButton: true,
      });

      setIsInCall(true);

    } else {
      // First time click -> Set ready to join and go to CBE
      localStorage.setItem('pendingJoinCourseId', courseId); // Save as pending
      setTimeout(() => {
        window.location.href = "https://www.combanketh.et/";
      }, 500);
    }
  };*/

return (
  <div className="consultation-page">
    {roomId || isInCall ? (
      <div className="video-container">
        <div ref={callContainerRef} style={{ width: '100%', height: '100vh' }} />
      </div>
    ) : (
      <>
        <h2 className="fancy-heading text-center">Select a Consultation Field</h2>
        <div className="course-grid">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              {course.image && <img src={course.image} alt={course.title} />}
              <div className="card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p><strong>Price: {course.price}</strong></p>
                <button
                  className="btn-dark-theme"
                  onClick={() => handleClick(course.id)}
                >
                  {fieldReadyToJoin === course.id ? 'Join' : 'Start Video Chat'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

};

export default Consultation;
