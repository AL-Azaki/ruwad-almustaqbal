import { Phone, Mail, MapPin, Ghost, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">
              {i18n.language === 'en' && (settings?.siteName === 'رواد المستقبل' || !settings?.siteName) ? 'Future Pioneers' : (settings?.siteName || 'رواد المستقبل')}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 inline-block">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-amber-500 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/services" className="hover:text-amber-500 transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/portfolio" className="hover:text-amber-500 transition-colors">{t('nav.portfolio')}</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500 transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 inline-block">{t('footer.contactInfo')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t('contact.locationValue')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <a href={`tel:${settings?.contactPhone || '+966506396004'}`} className="text-sm hover:text-amber-500 transition-colors" dir="ltr">{settings?.contactPhone || '+966 50 639 6004'}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <a href={`mailto:${settings?.contactEmail || 'info@futurepioneers.com'}`} className="text-sm hover:text-amber-500 transition-colors">{settings?.contactEmail || 'info@futurepioneers.com'}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm">{t('contact.hoursValue')}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2 inline-block">{t('footer.social')}</h4>
            <div className="flex gap-4 mt-2 flex-wrap">
              <a href={settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace('+', '')}` : '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all transform hover:scale-110" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
              <a href={settings?.instagram || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={settings?.snapchat || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all transform hover:scale-110" aria-label="Snapchat">
                <Ghost className="w-5 h-5" />
              </a>
              <a href={settings?.facebook || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110" aria-label="Facebook">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={settings?.twitter || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-600 hover:text-white transition-all transform hover:scale-110" aria-label="X">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.921z"/></svg>
              </a>

            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
          <p className="mt-2 md:mt-0">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
