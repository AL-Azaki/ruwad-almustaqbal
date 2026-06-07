import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X, ShieldUser, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };



  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-amber-500 font-bold text-2xl z-50">
          <Rocket className="w-8 h-8" />
          <span className="text-gray-900 dark:text-white">
            {i18n.language === 'en' && (settings?.siteName === 'رواد المستقبل' || !settings?.siteName) ? 'Future Pioneers' : (settings?.siteName || 'رواد المستقبل')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-600 dark:text-gray-300">
          <Link to="/" className="hover:text-amber-500 transition-colors">{t('nav.home')}</Link>
          <Link to="/services" className="hover:text-amber-500 transition-colors">{t('nav.services')}</Link>
          <Link to="/portfolio" className="hover:text-amber-500 transition-colors">{t('nav.portfolio')}</Link>
          <Link to="/contact" className="hover:text-amber-500 transition-colors">{t('nav.contact')}</Link>
        </nav>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-4 z-50">

          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="flex items-center gap-1 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="flex p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <span className="dark:hidden"><Moon className="w-5 h-5" /></span>
            <span className="hidden dark:block"><Sun className="w-5 h-5" /></span>
          </button>

          {/* Admin Dashboard Link */}
          <Link to="/admin/dashboard" title="Admin Dashboard" className="flex p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ShieldUser className="w-5 h-5" />
          </Link>

          <Link to="/contact" className="hidden md:inline-flex bg-amber-500 text-white px-5 py-2 rounded-full font-bold hover:bg-amber-600 transition-all">
            {t('nav.requestService')}
          </Link>

          {/* Hamburger Menu Icon */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 origin-top overflow-hidden ${isMenuOpen ? 'max-h-96 border-t dark:border-gray-800' : 'max-h-0'}`}>
        <nav className="flex flex-col p-4 gap-4 text-gray-600 dark:text-gray-300 font-medium">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('nav.home')}</Link>
          <Link to="/services" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('nav.services')}</Link>
          <Link to="/portfolio" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('nav.portfolio')}</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-500 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('nav.contact')}</Link>
          <div className="flex items-center justify-between mt-2 pt-2 border-t dark:border-gray-800">
            <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 transition-colors">
              <Globe className="w-5 h-5" />
              <span>{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
            <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 transition-colors">
              <span className="dark:hidden flex items-center gap-2"><Moon className="w-5 h-5" /> وضع ليلي</span>
              <span className="hidden dark:flex items-center gap-2"><Sun className="w-5 h-5" /> وضع نهاري</span>
            </button>
          </div>

          <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <ShieldUser className="w-5 h-5" />
            <span>لوحة التحكم (Admin)</span>
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="bg-amber-500 text-white px-5 py-3 rounded-xl font-bold text-center mt-2 hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/30">
            {t('nav.requestService')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
