import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Star, CheckCircle, XCircle, Trash2, ShieldAlert, Edit, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TestimonialType {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>(() => {
    const cached = localStorage.getItem('admin_testimonials');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(testimonials.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    is_approved: false
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = () => {
    if (testimonials.length === 0) setLoading(true);
    setError(null);
    api.get('/admin/testimonials')
      .then(res => {
        setTestimonials(res.data);
        localStorage.setItem('admin_testimonials', JSON.stringify(res.data));
      })
      .catch(err => {
        console.error('Failed to fetch testimonials:', err);
        const errMsg = err.response?.data?.message || err.message || 'Unknown error';
        setError(`تعذر جلب الآراء. تحقق من اتصالك أو تسجيل الدخول. (الخطأ: ${errMsg})`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleApproval = (id: number) => {
    // Optimistic Update
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_approved: !t.is_approved } : t));
    
    api.patch(`/testimonials/${id}/approve`)
      .catch(() => {
        toast.error('فشل في تغيير الحالة');
        // Revert on error
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_approved: !t.is_approved } : t));
      });
  };

  const deleteTestimonial = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
      // Optimistic Update
      const previousTestimonials = [...testimonials];
      setTestimonials(prev => prev.filter(t => t.id !== id));
      
      api.delete(`/testimonials/${id}`)
        .then(() => toast.success('تم الحذف بنجاح'))
        .catch(() => {
          toast.error('فشل في الحذف');
          setTestimonials(previousTestimonials);
        });
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', text: '', rating: 5, is_approved: true });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: TestimonialType) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      text: testimonial.text,
      rating: testimonial.rating,
      is_approved: testimonial.is_approved
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const request = editingId 
      ? api.put(`/testimonials/${editingId}`, formData)
      : api.post('/testimonials', formData);

    request
      .then((res) => {
        toast.success(editingId ? 'تم التعديل بنجاح' : 'تمت الإضافة بنجاح');
        setIsModalOpen(false);
        // Optimistic / Local update instead of refetching everything
        if (editingId) {
          setTestimonials(prev => prev.map(t => t.id === editingId ? { ...t, ...formData } : t));
        } else {
          setTestimonials(prev => [res.data.testimonial, ...prev]);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('حدث خطأ أثناء الحفظ');
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return <div className="text-center py-10 dark:text-white font-bold animate-pulse">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة آراء العملاء</h1>
        <button 
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" /> إضافة رأي جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {error ? (
          <div className="col-span-full text-center py-12 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/30">
            {error}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            لا توجد آراء مسجلة حتى الآن.
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 relative flex flex-col transition-all hover:shadow-lg hover:border-amber-500/50 group">
              
              {!testimonial.is_approved && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl shadow-sm flex items-center gap-1.5 z-10">
                  <ShieldAlert className="w-3.5 h-3.5" /> قيد المراجعة
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} />
                  ))}
                </div>
                <button 
                  onClick={() => openEditModal(testimonial)}
                  className="p-2 text-gray-400 hover:text-amber-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                  title="تعديل الرأي"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-6 flex-grow font-medium leading-loose text-lg">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-5 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{testimonial.role || 'عميل مميز'}</p>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <p className="text-xs text-gray-400">{new Date(testimonial.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <button
                  onClick={() => toggleApproval(testimonial.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    testimonial.is_approved 
                      ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50 dark:bg-gray-800 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-500/10' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                  }`}
                >
                  {testimonial.is_approved ? (
                    <><XCircle className="w-4 h-4" /> إلغاء النشر</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> الموافقة والنشر</>
                  )}
                </button>
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="p-2.5 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 rounded-xl transition-all"
                  title="حذف الرأي"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? 'تعديل الرأي' : 'إضافة رأي جديد'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">الاسم <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">المسمى (اختياري)</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">التقييم</label>
                <div className="flex gap-2 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      onClick={() => setFormData({...formData, rating: star})}
                      className={`w-8 h-8 transition-colors ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700'}`} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">نص الرأي <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={4}
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                ></textarea>
              </div>

              {editingId && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input 
                    type="checkbox" 
                    id="is_approved"
                    checked={formData.is_approved}
                    onChange={(e) => setFormData({...formData, is_approved: e.target.checked})}
                    className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="is_approved" className="text-gray-700 dark:text-gray-300 font-bold text-sm cursor-pointer">
                    نشر الرأي في الموقع (موافق عليه)
                  </label>
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
