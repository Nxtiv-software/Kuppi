import React from 'react';
import { MessageSquare, Users, VideoIcon, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Vote',
    description: 'Choose what topic you need help with.',
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    number: '2',
    title: 'Get matched',
    description: 'We find others like you and organize a session.',
    icon: Users,
    color: 'bg-green-100 text-green-600'
  },
  {
    number: '3',
    title: 'Join the Session',
    description: 'Learn with an expert tutor, right when you need it.',
    icon: VideoIcon,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    number: '4',
    title: 'Catch Up, Together',
    description: 'Review, ask questions, and get back on track.',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-600'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it works?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized help in just four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="text-center">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="absolute -right-1 -top-1 w-3 h-3 border-r-2 border-b-2 border-gray-300 transform rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;