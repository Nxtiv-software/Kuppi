import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Thevini Perera',
    text: 'Great help! I was really struggling with Organic Chemistry. The tutor explained everything so clearly.',
    rating: 5,
    subject: 'Chemistry'
  },
  {
    name: 'Thevini Perera',
    text: 'Great help! I was really struggling with Organic Chemistry. The tutor explained everything so clearly.',
    rating: 5,
    subject: 'Mathematics'
  },
  {
    name: 'Thevini Perera',
    text: 'Great help! I was really struggling with Organic Chemistry. The tutor explained everything so clearly.',
    rating: 5,
    subject: 'Physics'
  },
  {
    name: 'Thevini Perera',
    text: 'Great help! I was really struggling with Organic Chemistry. The tutor explained everything so clearly.',
    rating: 5,
    subject: 'Biology'
  },
  {
    name: 'Thevini Perera',
    text: 'Great help! I was really struggling with Organic Chemistry. The tutor explained everything so clearly.',
    rating: 5,
    subject: 'Economics'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From Struggle to Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our students transformed their learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.subject}</p>
                </div>
                
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          {testimonials.slice(3, 5).map((testimonial, index) => (
            <div 
              key={index + 3}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.subject}</p>
                </div>
                
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;