import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Globe, Phone, Mail, Building2, Link2, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../../contexts/SettingsContext';
import api from '../../lib/api';
import { useTranslation } from 'react-i18next';

export default function AdminSettings() {
  const { i18n } = useTranslation();
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    facebook: '',
    twitter: '',
    instagram: '',
    snapchat: '',
    tiktok: '',
    theme: 'light',
    language: 'ar',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        whatsappNumber: settings.whatsappNumber || '',
        facebook: settings.facebook || '',
        twitter: settings.twitter || '',
        instagram: settings.instagram || '',
        snapchat: settings.snapchat || '',
        tiktok: settings.tiktok || '',
        theme: settings.theme || 'light',
        language: settings.language || 'ar',
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.post('/settings', formData);
      await refreshSettings();
      
      // Update i18n language if changed
      if (formData.language !== i18n.language) {
        i18n.changeLanguage(formData.language);
        document.documentElement.dir = formData.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = formData.language;
      }

      toast.success('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'إعدادات عامة', icon: Globe },
    { id: 'contact', label: 'معلومات التواصل', icon: Phone },
    { id: 'social', label: 'التواصل الاجتماعي', icon: Link2 },
    { id: 'appearance', label: 'المظهر', icon: LayoutTemplate },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-amber-500" />
          إعدادات النظام
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">قم بإدارة إعدادات الموقع، وتحديث معلومات التواصل والمظهر العام.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 p-4 border-b md:border-b-0 md:border-l border-gray-100 dark:border-gray-700">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 md:p-10">
          <form onSubmit={handleSave} className="h-full flex flex-col">
            <div className="flex-1 space-y-6">
              
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-500" /> معلومات الموقع الأساسية
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم الموقع</label>
                    <input 
                      type="text" 
                      value={formData.siteName}
                      onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">وصف الموقع (SEO)</label>
                    <textarea 
                      rows={4}
                      value={formData.siteDescription}
                      onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-shadow"
                    />
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-amber-500" /> قنوات التواصل الرئيسية
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني الرسمي</label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="email" 
                          dir="ltr"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-left"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الهاتف العام</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="text" 
                          dir="ltr"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-left"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الواتساب (لإغلاق الصفقات)</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                        <input 
                          type="text" 
                          dir="ltr"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 focus:ring-2 focus:ring-green-500 text-left border-green-200 dark:border-green-800"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">هذا الرقم سيظهر في الزر العائم في جميع صفحات الموقع.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Tab */}
              {activeTab === 'social' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-amber-500" /> شبكات التواصل الاجتماعي
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط تويتر (X)</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="url" 
                          dir="ltr"
                          value={formData.twitter}
                          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-left"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط انستجرام</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500 w-5 h-5" />
                        <input 
                          type="url" 
                          dir="ltr"
                          value={formData.instagram}
                          onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-left"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط سناب شات</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 w-5 h-5" />
                        <input 
                          type="url" 
                          dir="ltr"
                          value={formData.snapchat}
                          onChange={(e) => setFormData({...formData, snapchat: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-left"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رابط تيك توك</label>
                      <div className="relative">
                        <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-gray-300 w-5 h-5" />
                        <input 
                          type="url" 
                          dir="ltr"
                          value={formData.tiktok}
                          onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-left"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-amber-500" /> المظهر والتخصيص
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">الوضع الافتراضي للنظام</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.theme === 'light' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="theme" value="light" className="sr-only" checked={formData.theme === 'light'} onChange={() => setFormData({...formData, theme: 'light'})} />
                        <div className="w-16 h-10 bg-white border border-gray-200 rounded shadow-sm"></div>
                        <span className="font-bold">الوضع الفاتح</span>
                      </label>
                      
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.theme === 'dark' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="theme" value="dark" className="sr-only" checked={formData.theme === 'dark'} onChange={() => setFormData({...formData, theme: 'dark'})} />
                        <div className="w-16 h-10 bg-gray-900 rounded shadow-sm flex items-center justify-center"><div className="w-8 h-4 bg-gray-800 rounded"></div></div>
                        <span className="font-bold">الوضع الداكن</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">لغة النظام</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.language === 'ar' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="language" value="ar" className="sr-only" checked={formData.language === 'ar'} onChange={() => setFormData({...formData, language: 'ar'})} />
                        <span className="font-bold text-xl">🇸🇦</span>
                        <span className="font-bold">العربية</span>
                      </label>
                      
                      <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.language === 'en' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <input type="radio" name="language" value="en" className="sr-only" checked={formData.language === 'en'} onChange={() => setFormData({...formData, language: 'en'})} />
                        <span className="font-bold text-xl">🇺🇸</span>
                        <span className="font-bold">English</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-gray-900/20 dark:shadow-white/10 disabled:opacity-70 disabled:hover:bg-gray-900 active:scale-95"
              >
                {saving ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> جاري الحفظ...</>
                ) : (
                  <><Save className="w-5 h-5" /> حفظ التغييرات</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
