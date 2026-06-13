import { useState, useEffect } from 'react';
import { Zap, Wifi, Video, Droplet, Lightbulb, PenTool, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import api from '../lib/api';

const iconMap: Record<string, React.ReactNode> = {
  'Zap': <Zap className="w-10 h-10 text-amber-500" />,
  'Wifi': <Wifi className="w-10 h-10 text-blue-500" />,
  'Video': <Video className="w-10 h-10 text-red-500" />,
  'Droplet': <Droplet className="w-10 h-10 text-cyan-500" />,
  'Lightbulb': <Lightbulb className="w-10 h-10 text-purple-500" />,
  'PenTool': <PenTool className="w-10 h-10 text-emerald-500" />
};

const colorMap = ['bg-amber-50 dark:bg-amber-900/30', 'bg-blue-50 dark:bg-blue-900/30', 'bg-red-50 dark:bg-red-900/30', 'bg-cyan-50 dark:bg-cyan-900/30', 'bg-purple-50 dark:bg-purple-900/30', 'bg-emerald-50 dark:bg-emerald-900/30'];
const borderMap = ['group-hover:border-amber-500', 'group-hover:border-blue-500', 'group-hover:border-red-500', 'group-hover:border-cyan-500', 'group-hover:border-purple-500', 'group-hover:border-emerald-500'];

interface ServiceType {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  starting_price: number | null;
}

export default function Services() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(response => {
        setServices(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching services", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>خدماتنا | رواد المستقبل - كهرباء، شبكات، كاميرات مراقبة، سباكة وديكور في جدة</title>
        <meta name="description" content="تعرف على خدمات رواد المستقبل الشاملة في جدة: تأسيس كهرباء، تمديد شبكات إنترنت، تركيب كاميرات مراقبة، سباكة، ديكورات بديل خشب ورخام، وصيانة منزلية عامة." />
        <meta name="keywords" content="الخدمات الكهربائية, تأسيس كهرباء للمنازل والفلل, صيانة الأعطال الكهربائية, تركيب القواطع الكهربائية, توزيع الأحمال الكهربائية, تركيب لوحات الكهرباء, خدمات الشبكات والإنترنت, تمديد شبكات الإنترنت, تركيب الراوترات والسويتشات, تنظيم الشبكات والكبائن, معالجة مشاكل الشبكات, تركيب نقاط الشبكة, أنظمة المراقبة, تركيب كاميرات المراقبة, تركيب أجهزة التسجيل DVR و NVR, السباكة, إصلاح التسريبات, تركيب الخلاطات, تركيب فلاتر المياه, صيانة السباكة المنزلية, الإنارة والديكور, تركيب الليدات, الإنارة المخفية, البديل الخشبي, بديل الرخام, الديكورات الداخلية, تصميم وتنفيذ ديكورات عصرية, تكسيات جدارية, أسقف معلقة وتصاميم جبسية, خدمات إضافية, تركيب الشاشات, تركيب قواعد الشاشات, أعمال الصيانة المنزلية المتنوعة, رواد المستقبل, جدة" />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('services.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('services.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent ${borderMap[index % borderMap.length]} cursor-pointer flex flex-col h-full`}
              >
                <div className={`w-20 h-20 rounded-2xl ${colorMap[index % colorMap.length]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon && iconMap[service.icon] ? iconMap[service.icon] : <PenTool className="w-10 h-10 text-gray-500 dark:text-gray-400" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                {service.starting_price && (
                  <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                    {t('services.startFrom')} {service.starting_price} {t('services.currency')}
                  </span>
                )}
                <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <Link 
                  to={`/contact?service=${service.title}`}
                  className="mt-auto inline-flex items-center text-amber-600 dark:text-amber-500 font-semibold hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {t('services.orderNow')}
                  <svg className={`w-5 h-5 mx-2 ${isAr ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">{t('services.ctaTitle')}</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            {t('services.ctaDesc')}
          </p>
          <Link to="/contact" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-full transition-all hover:shadow-lg hover:scale-105 relative z-10">
            {t('services.ctaBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
