import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '../../components/Button';
import { ArrowRight, Users, BookOpen } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation('global');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20 h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Section */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <Trans i18nKey="hero.title">
                Get the help you need, <span className="text-blue-600">Right when you need it!</span>
              </Trans>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {t("hero.description")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                type="button"
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
              >
                {t("hero.vote")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              <Button
                type="button"
                size="lg"
                variant="outline"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-md px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300"
              >
                {t("hero.explore")}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{t("hero.stat1")}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{t("hero.stat2")}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Card */}
          <div className="relative lg:ml-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-orange-400 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t("hero.card_title")}
                    </h3>
                    <p className="text-gray-600">{t("hero.card_text")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
