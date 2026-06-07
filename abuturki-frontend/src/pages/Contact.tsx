import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, MessageCircle, Send, Loader2, Ghost, User, Wrench, AlignLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import api from '../lib/api';

interface ServiceType {
  title: string;
}

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    service: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [servicesList, setServicesList] = useState<ServiceType[]>([]);

  useEffect(() => {
    // Check if there is a service selected from the query params
    const searchParams = new URLSearchParams(window.location.search);
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }

    // Fetch services for the dropdown
    api.get('/services').then(res => setServicesList(res.data)).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const orderData = {
      customer_name: formData.name,
      phone: formData.phone,
      location: formData.location,
      service_type: formData.service,
      description: formData.description
    };

    api.post('/orders', orderData)
      .then(() => {
        setSuccess(true);
        setFormData({ name: '', phone: '', location: '', service: '', description: '' });
      })
      .catch(err => {
        console.error(err);
        if (err.code === 'ECONNABORTED') {
          setError('تأخر الخادم في الاستجابة. يرجى التحقق من اتصال الإنترنت.');
        } else if (!err.response) {
          setError('لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً.');
        } else {
          setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل عبر الواتساب.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('contact.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('contact.titleHighlight')}</span> {t('contact.titleAfter')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('contact.infoTitle')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full text-amber-600 dark:text-amber-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.phone')}</h4>
                    <a href={`tel:${settings?.contactPhone || '+966506396004'}`} className="text-gray-600 dark:text-gray-400 mt-1 hover:text-amber-500 transition-colors block" dir="ltr">{settings?.contactPhone || '+966 50 639 6004'}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full text-green-600 dark:text-green-500">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.whatsapp')}</h4>
                    <a href={`https://wa.me/${(settings?.whatsappNumber || '966506396004').replace('+', '')}`} target="_blank" rel="noreferrer" className="text-green-600 dark:text-green-500 font-medium hover:underline mt-1 block">
                      {t('contact.whatsappLink')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full text-blue-600 dark:text-blue-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.location')}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{t('contact.locationValue')}<br/>{t('contact.hoursValue')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full text-red-600 dark:text-red-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.email')}</h4>
                    <a href={`mailto:${settings?.contactEmail || 'info@futurepioneers.com'}`} className="text-gray-600 dark:text-gray-400 mt-1 hover:text-amber-500 transition-colors block">{settings?.contactEmail || 'info@futurepioneers.com'}</a>
                  </div>
                </div>
              </div>

              {/* Added Social Media to Sidebar */}
              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                 <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-center">{t('contact.socialTitle')}</h4>
                 <div className="flex justify-center gap-4">
                   <a href="https://instagram.com/jeddah_technician" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                   </a>
                   <a href="https://www.snapchat.com/add/blzky2021" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all transform hover:scale-110">
                     <Ghost className="w-5 h-5" />
                   </a>
                   <a href="https://facebook.com/Jeddahtechnician" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                   </a>
                 </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700">
              
              {success ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 p-8 md:p-10 rounded-3xl text-center shadow-lg border border-green-100 dark:border-green-800/50 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/50 dark:bg-green-700/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/50 dark:bg-emerald-700/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white dark:bg-green-800 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-green-50 dark:border-green-900">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-green-800 dark:text-green-300 tracking-tight">تم استلام طلبك بنجاح! 🚀</h3>
                    
                    <div className="space-y-4 text-gray-700 dark:text-gray-200 text-lg leading-relaxed font-medium text-right md:text-center">
                      <p>أهلاً بك في عائلة <span className="text-amber-600 dark:text-amber-400 font-bold">رواد المستقبل للحلول التقنية</span>.</p>
                      <p>لقد وصل طلبك بأمان إلى فريقنا المختص، ونحن نوليه <strong className="text-green-700 dark:text-green-400">أولوية قصوى</strong>. سيقوم أحد المهندسين أو الفنيين المختصين بدراسة تفاصيل طلبك والتواصل معك في أسرع وقت ممكن (عادةً خلال وقت قصير جداً).</p>
                      
                      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm p-5 rounded-2xl mt-6 border border-white/50 dark:border-white/5 shadow-sm text-center">
                        <p className="text-base text-gray-800 dark:text-gray-300">
                          نحن نقدر ثقتك الغالية بنا، ونعدك بتقديم خدمة <strong className="text-amber-600 dark:text-amber-400">احترافية ومضمونة ترضيك 100%</strong>.<br/>
                          <span className="inline-block mt-2 font-bold text-green-700 dark:text-green-400">لا داعي للبحث بعيداً.. الحل المضمون صار بين أيدينا! 🛠️✨</span>
                        </p>
                      </div>
                    </div>
                    
                    <button onClick={() => setSuccess(false)} className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all hover:shadow-lg hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-2 mx-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      تقديم طلب جديد
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl relative flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </div>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('contact.formName')} <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <User className="h-5 w-5" />
                          </div>
                          <input 
                            type="text" 
                            name="name"
                            required
                            minLength={3}
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
                            placeholder="الاسم الثلاثي..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('contact.formPhone')} <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <Phone className="h-5 w-5" />
                          </div>
                          <input 
                            type="tel" 
                            name="phone"
                            required
                            pattern="^05[0-9]{8}$"
                            title="يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
                            value={formData.phone}
                            onChange={handleChange}
                            dir="ltr"
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-right shadow-sm"
                            placeholder="05X XXX XXXX"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">مثال: 0501234567</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('contact.formService')} <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <Wrench className="h-5 w-5" />
                          </div>
                          <select 
                            name="service"
                            required
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm appearance-none"
                          >
                            <option value="" disabled>{t('contact.formServiceSelect')}</option>
                            {servicesList.length > 0 ? (
                              servicesList.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)
                            ) : (
                              <>
                              <option value="كهرباء">تأسيس وصيانة كهرباء</option>
                              <option value="شبكات">تأسيس شبكات وانترنت</option>
                              <option value="سباكة">سباكة عامة</option>
                              <option value="كاميرات">كاميرات مراقبة</option>
                              <option value="ديكورات">ديكورات</option>
                              <option value="إنارة">تأسيس إنارة</option>
                              <option value="سمارت هوم">أنظمة منازل ذكية (Smart Home)</option>
                              <option value="أخرى">أخرى</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('contact.formLocation')} <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <input 
                            type="text" 
                            name="location"
                            required
                            minLength={4}
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
                            placeholder="حي الصفا، شارع الأربعين..."
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('contact.formDesc')} <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute top-3 right-4 flex items-start pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                          <AlignLeft className="h-5 w-5" />
                        </div>
                        <textarea 
                          name="description"
                          required
                          minLength={10}
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all resize-none shadow-sm"
                          placeholder="يرجى كتابة تفاصيل المشكلة أو الطلب بدقة لتسهيل خدمتك..."
                        ></textarea>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className={`w-full bg-gray-900 dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <>
                          <span>{t('contact.formLoading')}</span>
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </>
                      ) : (
                        <>
                          <span>{t('contact.formSubmit')}</span>
                          <Send className={`w-5 h-5 transition-transform ${isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
