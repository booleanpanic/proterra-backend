import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-300">PROTERRA</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-300">{t('footer.contact')}</h4>
                        <div className="text-gray-400 text-sm space-y-2">
                            <p>{t('footer.location')}</p>
                            <p>+994 50 340 39 38</p>
                            <p>info@proterra.az</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-300">{t('footer.follow')}</h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/proterra.az/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.tiktok.com/@proterra.az"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                TikTok
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} {t('footer.rights')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
