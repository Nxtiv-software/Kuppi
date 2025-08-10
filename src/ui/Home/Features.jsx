import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Users, Clock, DollarSign } from 'lucide-react';

const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];

const Features = () => {
  const { t, i18n } = useTranslation();

  const featureItems = t('features.items', { returnObjects: true });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.heading')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subheading')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureItems.map((feature, index) => {
            const Icon = [Brain, Users, Clock, DollarSign][index];
            const color = colors[index];

            return (
              <div 
                key={index}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${i18n.language === 'si' ? 'text-[18px]' : ''}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed ${i18n.language === 'si' ? 'text-[16px]' : ''}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
