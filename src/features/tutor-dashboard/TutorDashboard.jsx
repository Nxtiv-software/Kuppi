import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs';
import TutorOverview from '../tutor-dashboard/TutorOverview';
import MySchedule from '../tutor-dashboard/MySchedule';
import SessionRequests from '../tutor-dashboard/SessionRequests';
import Earnings from '../tutor-dashboard/Earnings';
import StudentFeedback from '../tutor-dashboard/StudentFeedback';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutor Dashboard</h1>
          <p className="text-gray-600">Manage your sessions, schedule, and student interactions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Session Requests</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

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