import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-48 pb-16 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 text-proterra-dark">{t('aboutPage.title')}</h1>

                <div className="prose prose-lg text-gray-600 mb-12">
                    <p className="lead text-xl text-gray-800 mb-6 font-medium">
                        {t('aboutPage.history')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    <div className="bg-gray-100 p-8 rounded-sm">
                        <h3 className="text-xl font-bold mb-4">{t('aboutPage.missionTitle')}</h3>
                        <p className="text-gray-600">{t('aboutPage.mission')}</p>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-sm">
                        <h3 className="text-xl font-bold mb-4">{t('aboutPage.visionTitle')}</h3>
                        <p className="text-gray-600">{t('aboutPage.vision')}</p>
                    </div>
                    <div className="bg-gray-100 p-8 rounded-sm md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">{t('aboutPage.valuesTitle')}</h3>
                        <p className="text-gray-600">{t('aboutPage.values')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
