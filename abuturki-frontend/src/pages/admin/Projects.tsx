import { useState, useEffect } from 'react';
import { Loader2, Plus, RefreshCw, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../../lib/api';

interface Project {
  id: number;
  title: string;
  category: string;
  image_path: string | null;
  description: string;
  updated_at?: string;
}

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>(() => {
    const cached = localStorage.getItem('admin_projects');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(projects.length === 0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<'link' | 'file'>('file');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      localStorage.setItem('admin_projects', JSON.stringify(res.data));
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/projects/${deleteConfirmId}`);
      setProjects(projects.filter(p => p.id !== deleteConfirmId));
      toast.success('تم حذف المشروع بنجاح');
    } catch (error) {
      console.error('Failed to delete project', error);
      toast.error('حدث خطأ أثناء الحذف');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      
      if (uploadMode === 'file' && imageFile) {
        data.append('image', imageFile);
      } else if (uploadMode === 'link' && formData.image_url) {
        data.append('image_url', formData.image_url);
      }

      if (editingId) {
        // Use POST with _method=PUT, or just POST if the backend supports it. We mapped POST /projects/{id} to update
        await api.post(`/projects/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('تم تحديث المشروع بنجاح');
      } else {
        await api.post('/projects', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('تم إضافة المشروع بنجاح');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', category: '', description: '', image_url: '' });
      setImageFile(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project', error);
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      category: project.category || '',
      description: project.description || '',
      image_url: project.image_path || ''
    });
    setUploadMode(project.image_path && project.image_path.startsWith('/storage') ? 'file' : 'link');
    setEditingId(project.id);
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.projects.title')}</h1>
        <div className="flex gap-3">
          <button onClick={fetchProjects} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> {t('admin.projects.refreshBtn')}
          </button>
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', category: '', description: '', image_url: '' });
              setImageFile(null);
              setShowForm(true);
            }} 
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> {t('admin.projects.addBtn')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir={t('admin.projects.title') === 'Projects Management (Portfolio)' ? 'ltr' : 'rtl'}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'تعديل المشروع' : t('admin.projects.modal.title')}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <form id="projectForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.projects.modal.nameLabel')}</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" placeholder={t('admin.projects.modal.namePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.projects.modal.categoryLabel')}</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" placeholder={t('admin.projects.modal.categoryPlaceholder')} />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{t('admin.projects.modal.mediaLabel')}</label>
                  <div className="flex gap-2 mb-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
                    <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${uploadMode === 'file' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('admin.projects.modal.uploadPhone')}</button>
                    <button type="button" onClick={() => setUploadMode('link')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${uploadMode === 'link' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{t('admin.projects.modal.uploadUrl')}</button>
                  </div>

                  {uploadMode === 'file' ? (
                    <div>
                      <input type="file" accept="image/*,video/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 dark:file:bg-amber-900/30 file:text-amber-700 dark:file:text-amber-500 hover:file:bg-amber-100 transition-colors" />
                      <p className="text-xs text-gray-400 mt-2">{t('admin.projects.modal.fileHelp')}</p>
                    </div>
                  ) : (
                    <div>
                      <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-left" dir="ltr" placeholder={t('admin.projects.modal.urlPlaceholder')} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('admin.projects.modal.detailsLabel')}</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 outline-none h-28 resize-none transition-shadow" placeholder={t('admin.projects.modal.detailsPlaceholder')} />
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 font-bold text-gray-700 dark:text-gray-300 transition-colors">{t('admin.projects.modal.cancel')}</button>
              <button type="submit" form="projectForm" disabled={submitting} className="px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-white font-bold flex items-center gap-2 transition-colors disabled:opacity-70">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('admin.projects.modal.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const getImageUrl = (path: string | null) => {
            if (!path) return null;
            if (path.startsWith('http')) return path;
            // Prevent browser caching issues for newly uploaded images without causing re-render flickering
            const cacheBuster = typeof project.updated_at === 'string' ? new Date(project.updated_at).getTime() : project.id;
            if (path.startsWith('/storage')) {
              const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
              return `${baseUrl}${path}?v=${cacheBuster}`;
            }
            return path;
          };
          const imageUrl = getImageUrl(project.image_path);
          const isVideo = imageUrl && /\.(mp4|webm|ogg|mov)$/i.test(imageUrl.split('?')[0]);
          
          return (
          <div key={project.id} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
            <div className="h-56 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
              {imageUrl ? (
                isVideo ? (
                  <video src={imageUrl} controls playsInline className="w-full h-full object-contain bg-black" />
                ) : (
                  <img src={imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-10 h-10 mb-3 text-gray-300 dark:text-gray-600 transition-transform duration-500 group-hover:scale-110" />
                  <span className="text-sm font-medium">{(t('portfolio.comingSoon') || 'No Image')}</span>
                </div>
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-500 shadow-sm border border-amber-100 dark:border-amber-900/30 pointer-events-none">
                {project.category}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-extrabold text-xl mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                {project.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">
                {project.description}
              </p>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50">
                <button 
                  onClick={() => handleEdit(project)} 
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-xl transition-colors font-bold text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> 
                  تعديل
                </button>
                <button 
                  onClick={() => handleDeleteClick(project.id)} 
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-colors font-bold text-sm"
                >
                  <Trash2 className="w-4 h-4" /> 
                  حذف
                </button>
              </div>
            </div>
          </div>
          );
        })}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            {t('admin.projects.empty')}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
