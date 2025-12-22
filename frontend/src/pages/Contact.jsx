import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();

    return (
        <div className="pt-48 pb-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-12 text-center">{t('contactPage.title')}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-sm rounded-sm overflow-hidden">
                    {/* Contact Info */}
                    <div className="p-10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">{t('contactPage.getInTouch')}</h3>
                            <p className="text-gray-600 mb-8">
                                {t('contactPage.subtitle')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-black" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900">{t('contactPage.visitUs')}</h4>
                                    <p className="mt-1 text-gray-500">{t('contactPage.address')}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Phone className="h-6 w-6 text-black" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900">{t('contactPage.callUs')}</h4>
                                    <p className="mt-1 text-gray-500">+994 50 340 39 38</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Mail className="h-6 w-6 text-black" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900">{t('contactPage.emailUs')}</h4>
                                    <p className="mt-1 text-gray-500">info@proterra.az</p>
                                    <p className="text-gray-500">sales@proterra.az</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-black" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-medium text-gray-900">{t('contactPage.workingHours')}</h4>
                                    <p className="mt-1 text-gray-500">{t('contactPage.schedule')}</p>
                                    <p className="text-gray-500">{t('contactPage.saturday')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="bg-gray-200 h-full min-h-[400px]">
                        <iframe
                            src="https://maps.google.com/maps?q=ProTerra%20Baku%20Babek%20pr%2031&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '400px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
