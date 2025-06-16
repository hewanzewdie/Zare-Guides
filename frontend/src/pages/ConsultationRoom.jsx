import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import "../styles/Consultation.css";

function randomID(len = 5) {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const ConsultationRoom = () => {
  const { roomId } = useParams();
  const callContainerRef = useRef(null);

  useEffect(() => {
    if (callContainerRef.current) {
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
    }
  }, [roomId]);

  return (
    <div className="video-container">
      <div ref={callContainerRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default ConsultationRoom;
