import { useState, useEffect } from 'react';
import { Loader2, Plus, RefreshCw, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../../lib/api';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  starting_price: number | null;
  status: 'active' | 'inactive';
}

export default function AdminServices() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>(() => {
    const cached = localStorage.getItem('admin_services');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Wrench',
    starting_price: '',
    status: 'active'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
      localStorage.setItem('admin_services', JSON.stringify(res.data));
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/services/${id}/status`, { status: newStatus });
      setServices(services.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast.success(newStatus === 'active' ? 'تم تنشيط الخدمة بنجاح' : 'تم إخفاء الخدمة بنجاح');
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('حدث خطأ أثناء تحديث حالة الخدمة');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...formData,
        starting_price: formData.starting_price ? parseFloat(formData.starting_price) : null
      };
      
      if (editingId) {
        const response = await api.put(`/services/${editingId}`, data);
        
        // Update local state for immediate feedback
        setServices(services.map(s => s.id === editingId ? { ...s, ...response.data } : s));
        toast.success('تم تحديث الخدمة بنجاح');
      } else {
        await api.post('/services', data);
        toast.success('تم إضافة الخدمة بنجاح');
        fetchServices();
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', icon: 'Wrench', starting_price: '', status: 'active' });
    } catch (error) {
      console.error('Failed to save service', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || 'Wrench',
      starting_price: service.starting_price ? service.starting_price.toString() : '',
      status: service.status
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.services.title')}</h1>
        <div className="flex gap-3">
          <button onClick={fetchServices} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> {t('admin.services.refreshBtn')}
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ title: '', description: '', icon: 'Wrench', starting_price: '', status: 'active' }); setShowForm(true); }} className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> {t('admin.services.addBtn')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir={t('admin.services.title') === 'Services Management' ? 'ltr' : 'rtl'}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'تعديل الخدمة' : t('admin.services.modal.title')}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.nameLabel')}</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" placeholder={t('admin.services.modal.namePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.priceLabel')}</label>
                    <input type="number" step="0.01" value={formData.starting_price} onChange={e => setFormData({...formData, starting_price: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow text-left" dir="ltr" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.iconLabel')}</label>
                    <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" dir="ltr" placeholder={t('admin.services.modal.iconPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.statusLabel')}</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow">
                      <option value="active">{t('admin.services.status.active')}</option>
                      <option value="inactive">{t('admin.services.status.inactive')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.services.modal.descLabel')}</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none h-28 resize-none transition-shadow" placeholder={t('admin.services.modal.descPlaceholder')} />
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 font-bold text-gray-700 dark:text-gray-300 transition-colors">{t('admin.services.modal.cancel')}</button>
              <button type="submit" form="serviceForm" disabled={submitting} className="px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-white font-bold flex items-center gap-2 transition-colors disabled:opacity-70">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('admin.services.modal.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
            {service.status === 'inactive' && (
              <div className="absolute top-4 left-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">{t('admin.services.status.hiddenBadge')}</div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <Wrench className="w-6 h-6" />
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>

                  {/* Toggle Switch */}
                  <button 
                    onClick={() => toggleStatus(service.id, service.status)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${service.status === 'active' ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    role="switch"
                    aria-checked={service.status === 'active'}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${service.status === 'active' ? (t('admin.services.title') === 'Services Management' ? 'translate-x-5' : '-translate-x-5') : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">{service.title}</h3>
              {service.starting_price && (
                <div className="text-green-600 dark:text-green-400 text-sm font-bold mb-3 bg-green-50 dark:bg-green-900/30 inline-block px-2 py-1 rounded">
                  {t('admin.services.startsFrom')} {service.starting_price} {t('admin.services.currency')}
                </div>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            {t('admin.services.empty')}
          </div>
        )}
      </div>
    </div>
  );
}
