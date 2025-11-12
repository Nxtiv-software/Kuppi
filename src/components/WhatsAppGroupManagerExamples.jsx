// Example: How to integrate WhatsAppGroupManager into existing session pages

import React from 'react';
import WhatsAppGroupManager from '../components/WhatsAppGroupManager';
import { useUser } from '@clerk/clerk-react';

// Example 1: In Tutor Dashboard - My Schedule Page
const TutorSessionDetails = ({ session }) => {
  const { user } = useUser();
  const isTutor = session.tutorId === user?.id;

  return (
    <div>
      <h2>{session.title}</h2>
      <p>{session.description}</p>
      
      {/* Existing session info... */}
      
      {/* Add WhatsApp Group Manager */}
      <WhatsAppGroupManager 
        sessionId={session._id} 
        isTutor={isTutor} 
      />
      
      {/* Rest of session resources... */}
    </div>
  );
};

// Example 2: In Student Dashboard - My Sessions Page
const StudentSessionDetails = ({ session }) => {
  return (
    <div>
      <h2>{session.title}</h2>
      <p>Tutor: {session.tutorName}</p>
      
      {/* Existing session info... */}
      
      {/* Add WhatsApp Group Manager */}
      <WhatsAppGroupManager 
        sessionId={session._id} 
        isTutor={false} 
      />
      
      {/* Other session details... */}
    </div>
  );
};

// Example 3: Add to MySchedule.jsx (Tutor Dashboard)
// In the session card modal or detail view:
{/*
  <div className="session-resources">
    <h3>Session Resources</h3>
    
    <WhatsAppGroupManager 
      sessionId={selectedSession._id} 
      isTutor={true} 
    />
    
    <TestSessionResources sessionId={selectedSession._id} />
  </div>
*/}

// Example 4: Add to MySessions.jsx (Student Dashboard)
// In the session detail modal:
{/*
  <div className="session-communication">
    <WhatsAppGroupManager 
      sessionId={session._id} 
      isTutor={false} 
    />
  </div>
*/}

export { TutorSessionDetails, StudentSessionDetails };
