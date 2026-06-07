import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.user));
      
      // Configure default auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'ECONNABORTED') {
        setError('تأخر الخادم في الاستجابة. يرجى التحقق من اتصال الإنترنت أو إعادة تشغيل الخادم.');
      } else if (!err.response) {
        setError('لا يمكن الاتصال بالخادم. تأكد من تشغيل (php artisan serve).');
      } else if (err.response.status >= 400 && err.response.status < 500) {
        setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة.');
      } else {
        setError('حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300 relative" dir="rtl">
      
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:-translate-x-1">
        <ArrowRight className="w-5 h-5" />
        <span className="font-bold text-sm">العودة للرئيسية</span>
      </Link>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        <div className="bg-gray-900 dark:bg-black p-8 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h2>
          <p className="text-gray-400">لوحة تحكم إدارة نظام رواد المستقبل</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-left"
                  dir="ltr"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 transition-all text-left"
                  dir="ltr"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-amber-500/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'الدخول للوحة التحكم'
              )}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
