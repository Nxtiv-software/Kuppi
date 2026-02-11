import React, { useState } from 'react';
import styles from './TutorDashboard.module.css';
import TutorOverviewShadcn from '../tutor-dashboard/TutorOverviewShadcn';
import MySchedule from '../tutor-dashboard/MySchedule';
import SessionRequests from '../tutor-dashboard/SessionRequests';
import CreateSession from '../tutor-dashboard/CreateSession';
import StudentFeedback from '../tutor-dashboard/StudentFeedback';
import Header from "../../ui/Home/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';


// Main Dashboard Component
const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Tutor Dashboard</h1>
          <p className={styles.subtitle}>
            Manage your sessions, schedule, and student interactions
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        
          <TabsList className="flex border-b w-full border-gray-200 bg-white rounded-lg overflow-hidden sticky top-20 z-10">
            <TabsTrigger
              value="overview"
              className={`flex-1 px-5 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition ${
                activeTab === "overview"
                  ? "text-gray-900 border-b-2 border-blue-600 bg-gray-50"
                  : ""
              }`}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className={`flex-1 px-5 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition ${
                activeTab === "requests"
                  ? "text-gray-900 border-b-2 border-blue-600 bg-gray-50"
                  : ""
              }`}
            >
              Session Requests
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className={`flex-1 px-5 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition ${
                activeTab === "schedule"
                  ? "text-gray-900 border-b-2 border-blue-600 bg-gray-50"
                  : ""
              }`}
            >
              My Schedule
            </TabsTrigger>
            <TabsTrigger
              value="create-session"
              className={`flex-1 px-5 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition ${
                activeTab === "create-session"
                  ? "text-gray-900 border-b-2 border-blue-600 bg-gray-50"
                  : ""
              }`}
            >
              Create Session
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className={`flex-1 px-5 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition ${
                activeTab === "feedback"
                  ? "text-gray-900 border-b-2 border-blue-600 bg-gray-50"
                  : ""
              }`}
            >
              Feedback
            </TabsTrigger>
          </TabsList>
       

          {/* Tab Pages */}
          <TabsContent value="overview">
            <TutorOverviewShadcn setActiveTab={setActiveTab} />
          </TabsContent>
          <TabsContent value="requests">
            <SessionRequests />
          </TabsContent>
          <TabsContent value="schedule">
            <MySchedule />
          </TabsContent>
          <TabsContent value="create-session">
            <CreateSession />
          </TabsContent>
          <TabsContent value="feedback">
            <StudentFeedback />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default TutorDashboard;