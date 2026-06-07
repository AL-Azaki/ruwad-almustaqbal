import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Briefcase, 
  Wrench, 
  LogOut, 
  Menu,
  X,
  User,
  Moon,
  Sun,
  Rocket,
  Settings,
  MessageSquare,
  Loader2
} from 'lucide-react';
import api from '../../lib/api';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout() {
  const { i18n, t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate a slight delay for better UX if the network is too fast
    await new Promise(resolve => setTimeout(resolve, 800));
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      delete api.defaults.headers.common['Authorization'];
      navigate('/admin/login');
      setIsLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navItems = [
    { name: t('admin.nav.home'), path: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('admin.nav.orders'), path: '/admin/orders', icon: ShoppingCart },
    { name: t('admin.nav.projects'), path: '/admin/projects', icon: Briefcase },
    { name: t('admin.nav.services'), path: '/admin/services', icon: Wrench },
    { name: 'آراء العملاء', path: '/admin/testimonials', icon: MessageSquare },
    { name: t('admin.nav.settings'), path: '/admin/settings', icon: Settings },
  ];

  // Retrieve user info
  const userStr = localStorage.getItem('admin_user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      <Toaster position={i18n.language === 'ar' ? 'bottom-left' : 'bottom-right'} toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl',
        duration: 4000,
      }} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-3 text-amber-500 font-bold text-xl">
            <Rocket className="w-6 h-6" />
            <span>رواد المستقبل</span>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name || 'مدير النظام'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@futurepioneers.com'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-amber-500 text-white font-semibold shadow-md shadow-amber-500/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            <span>{isLoggingOut ? 'جاري الخروج...' : t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">{t('admin.header.title')}</h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleLanguage} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="تغيير اللغة / Change Language">
              <span className="font-bold text-sm uppercase px-1">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="تبديل المظهر">
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            
            <Link to="/" target="_blank" className="text-sm font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-full hidden sm:block">
              {t('admin.header.viewSite')}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6 lg:p-10 transition-colors duration-200">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
