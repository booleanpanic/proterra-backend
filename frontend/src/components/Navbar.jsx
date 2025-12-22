import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, Instagram } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([
        {
            id: 1, name: 'concrete-panels', slug: 'concrete-panels',
            children: [
                { id: 101, name: 'fiber-panels', slug: 'fiber-panels' },
                { id: 102, name: 'relief-panels', slug: 'relief-panels' },
                { id: 103, name: 'perforated-panels', slug: 'perforated-panels' },
                { id: 104, name: 'curved-panels', slug: 'curved-panels' }
            ]
        },
        { id: 2, name: 'concrete-planters', slug: 'concrete-planters', children: [] },
        { id: 3, name: 'concrete-benches', slug: 'concrete-benches', children: [] },
        { id: 4, name: 'large-format-slabs', slug: 'large-format-slabs', children: [] },
        { id: 5, name: 'landscape-sculptures', slug: 'landscape-sculptures', children: [] },
        { id: 6, name: 'bollards', slug: 'bollards', children: [] },
        { id: 7, name: 'street-lights', slug: 'street-lights', children: [] },
        { id: 8, name: 'fire-pits', slug: 'fire-pits', children: [] },
    ]);
    const dropdownRef = useRef(null);

    // Fetch categories with children (updates static data if successful)
    useEffect(() => {
        api.get('/categories')
            .then(res => {
                if (res.data && res.data.length > 0) setCategories(res.data);
            })
            .catch(err => console.warn('API unavailable, using static menu', err));
    }, [i18n.language]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Disable on mobile to prevent conflict with accordion toggle
            if (window.innerWidth < 768) return;

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };

    const navItems = [
        { name: t('nav.catalog'), path: '/catalog', hasDropdown: true },
        { name: t('nav.projects'), path: '/projects' },
        { name: t('nav.textures'), path: '/textures' },
        { name: t('nav.features'), path: '/features' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.contact'), path: '/contact' },
    ];

    const currentLang = i18n.language || 'az';

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 font-sans ${scrolled ? 'bg-white shadow-sm py-2' : 'bg-white/95 py-4'}`}>
            <div className={`hidden md:flex justify-between items-center max-w-[1400px] mx-auto px-8 mb-4 transition-all duration-300 border-b border-gray-100 pb-2 ${scrolled ? 'h-0 opacity-0 overflow-hidden mb-0 pb-0 border-0' : 'h-auto opacity-100'}`}>
                <div className="text-sm font-sans flex items-center gap-6 text-gray-600">
                    <a href="tel:+994503403938" className="flex items-center gap-2 hover:text-black transition-colors font-medium">
                        <Phone size={18} />
                        <span>+994 50 340 39 38</span>
                    </a>
                    <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                        <a href="https://wa.me/994503403938" target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                            </svg>
                        </a>
                        <a href="https://instagram.com/proterra.az" target="_blank" rel="noreferrer" className="hover:text-[#E1306C] transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="https://tiktok.com/@proterra.az" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="flex text-sm font-bold gap-3 uppercase tracking-wide">
                    {['az', 'en', 'ru'].map((lang) => (
                        <button key={lang} onClick={() => changeLanguage(lang)} className={`${currentLang === lang ? 'text-black' : 'text-gray-400 hover:text-black'}`}>{lang}</button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center relative">
                <Link to="/" className="font-sans font-bold text-2xl tracking-widest uppercase py-2 border-2 border-black px-4 hover:bg-black hover:text-white transition-colors">
                    ProTerra
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <div key={item.path} className="relative group/main">
                            {item.hasDropdown ? (
                                <button
                                    className={`font-sans font-normal text-[15px] uppercase tracking-wide hover:text-red-500 transition-colors flex items-center gap-1 py-4 ${dropdownOpen ? 'text-red-500' : ''}`}
                                    onMouseEnter={() => setDropdownOpen(true)}
                                >
                                    {item.name}
                                    <ChevronDown size={14} />
                                </button>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="font-sans font-normal text-[15px] uppercase tracking-wide hover:opacity-60 transition-opacity py-4 block"
                                    onMouseEnter={() => setDropdownOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Main Dropdown (Full Width or Large) */}
                {dropdownOpen && (
                    <div
                        ref={dropdownRef}
                        onMouseLeave={() => setDropdownOpen(false)}
                        className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-8 px-8 hidden md:block"
                    >
                        <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-8">
                            <div className="col-span-1">
                                <h3 className="font-sans font-bold text-lg mb-4 text-red-500 uppercase">{t('nav.catalog')}</h3>
                                <p className="text-sm text-gray-500 mb-4">{t('nav.catalogDesc')}</p>
                            </div>
                            <div className="col-span-3 grid grid-cols-3 gap-y-2 gap-x-8">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="relative group/sub">
                                        <Link
                                            to={`/catalog?cat=${cat.slug}`}
                                            onClick={() => setDropdownOpen(false)}
                                            className="text-[15px] hover:text-red-500 transition-colors flex justify-between items-center font-medium text-gray-800 py-2"
                                        >
                                            {t(`categories.${cat.name}`, { defaultValue: cat.name })}
                                            {cat.children && cat.children.length > 0 && <ChevronRight size={14} />}
                                        </Link>

                                        {/* Nested Dropdown */}
                                        {cat.children && cat.children.length > 0 && (
                                            <div className="absolute left-full top-0 w-64 bg-white shadow-lg border border-gray-100 p-4 hidden group-hover/sub:block z-50 -ml-2 rounded-sm">
                                                {cat.children.map(sub => (
                                                    <Link
                                                        key={sub.id}
                                                        to={`/catalog?cat=${sub.slug}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDropdownOpen(false);
                                                        }}
                                                        className="block text-sm text-gray-600 hover:text-red-500 hover:bg-gray-50 py-2 px-2 transition-colors mb-1"
                                                    >
                                                        {t(`categories.${sub.name}`, { defaultValue: sub.name })}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible h-screen' : 'opacity-0 invisible h-0'} overflow-y-auto pb-40`}>
                <div className="flex flex-col p-6 space-y-6">
                    {navItems.map((item) => (
                        <div key={item.path} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            {item.hasDropdown ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                        <span className="font-sans font-bold text-lg uppercase tracking-widest">{item.name}</span>
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                    <div className={`space-y-4 pl-4 border-l-2 border-gray-100 transition-all duration-300 ${dropdownOpen ? 'block' : 'hidden'}`}>
                                        <Link to="/catalog" onClick={() => setIsOpen(false)} className="block font-medium text-red-500 uppercase text-sm mb-2">
                                            {t('homePage.viewCatalog')}
                                        </Link>
                                        {categories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                to={`/catalog?cat=${cat.slug}`}
                                                onClick={() => setIsOpen(false)}
                                                className="block text-gray-600 hover:text-black py-1"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="font-sans font-bold text-lg uppercase tracking-widest block"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Mobile Language Switcher */}
                    <div className="pt-6 mt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Select Language</p>
                        <div className="flex gap-4">
                            {['az', 'en', 'ru'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => { changeLanguage(lang); setIsOpen(false); }}
                                    className={`text-sm font-bold uppercase w-10 h-10 flex items-center justify-center rounded-full border ${currentLang === lang ? 'bg-black text-white border-black' : 'bg-transparent text-gray-500 border-gray-200'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Socials */}
                    <div className="pt-6 mt-2 border-t border-gray-100">
                        <div className="flex gap-6 justify-center">
                            <a href="tel:+994503403938" className="text-gray-500 hover:text-black">
                                <Phone size={24} />
                            </a>
                            <a href="https://wa.me/994503403938" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#25D366]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                </svg>
                            </a>
                            <a href="https://instagram.com/proterra.az" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#E1306C]">
                                <Instagram size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
