import React from 'react';
import { Brain, Users, Clock, DollarSign } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Focused Learning',
    description: 'Learn only what you are struggling with. No time wasted.',
    color: 'bg-blue-600'
  },
  {
    icon: Users,
    title: 'Expert Tutors',
    description: 'We carefully match each session with the right tutor who knows best.',
    color: 'bg-green-600'
  },
  {
    icon: Clock,
    title: 'Flexible Timing',
    description: 'We schedule each each session with the right time that works for you.',
    color: 'bg-purple-600'
  },
  {
    icon: DollarSign,
    title: 'Affordable',
    description: 'Quality learning at a fair and affordable price.',
    color: 'bg-orange-600'
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Study Smarter with Kuppi.LK
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience personalized learning with our innovative approach to education
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;