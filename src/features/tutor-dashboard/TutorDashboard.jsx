import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs';
import TutorOverview from '../tutor-dashboard/TutorOverview';
import MySchedule from '../tutor-dashboard/MySchedule';
import SessionRequests from '../tutor-dashboard/SessionRequests';
import Earnings from '../tutor-dashboard/Earnings';
import StudentFeedback from '../tutor-dashboard/StudentFeedback';
import Header from "../../ui/Home/Header";


const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reuse same header */}
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12 mt-20">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tutor Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
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
              value="earnings"
              className={`flex-1 px-5 py-3 text-center font-medium text-gray-600 hover:bg-gray-50 transition ${
                activeTab === "earnings"
                  ? "text-gray-900 border-b-2 border-blue-600 bg-gray-50"
                  : ""
              }`}
            >
              Earnings
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
            <TutorOverview setActiveTab={setActiveTab} />
          </TabsContent>
          <TabsContent value="requests">
            <SessionRequests />
          </TabsContent>
          <TabsContent value="schedule">
            <MySchedule />
          </TabsContent>
          <TabsContent value="earnings">
            <Earnings />
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