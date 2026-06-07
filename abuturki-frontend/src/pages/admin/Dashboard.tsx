import { useState, useEffect } from 'react';
import { ShoppingCart, Briefcase, Wrench, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    ordersCount: 0,
    projectsCount: 0,
    servicesCount: 0,
    pendingOrdersCount: 0,
    completedOrdersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, projectsRes, servicesRes] = await Promise.all([
          api.get('/orders'),
          api.get('/projects'),
          api.get('/services')
        ]);

        const orders = ordersRes.data;
        setStats({
          ordersCount: orders.length,
          projectsCount: projectsRes.data.length,
          servicesCount: servicesRes.data.length,
          pendingOrdersCount: orders.filter((o: any) => o.status === 'pending' || o.status === 'new').length,
          completedOrdersCount: orders.filter((o: any) => o.status === 'completed').length,
        });

        // Set recent 5 orders
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: t('admin.overview.totalOrders'), value: stats.ordersCount, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20 dark:border-blue-800', link: '/admin/orders' },
    { title: t('admin.overview.pendingOrders'), value: stats.pendingOrdersCount, icon: Clock, color: 'text-yellow-500', bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/20 dark:border-yellow-800', link: '/admin/orders' },
    { title: t('admin.overview.completedOrders'), value: stats.completedOrdersCount, icon: CheckCircle, color: 'text-green-500', bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/20 dark:border-green-800', link: '/admin/orders' },
    { title: t('admin.overview.projects'), value: stats.projectsCount, icon: Briefcase, color: 'text-amber-500', bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/20 dark:border-amber-800', link: '/admin/projects' },
    { title: t('admin.overview.services'), value: stats.servicesCount, icon: Wrench, color: 'text-purple-500', bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/20 dark:border-purple-800', link: '/admin/services' },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div></div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">{t('admin.overview.title')}</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group ${card.bg} border border-transparent`}>
              {/* Glassmorphism decoration */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/40 dark:bg-black/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white drop-shadow-sm">{card.value}</div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 font-bold text-sm sm:text-base mb-4 relative z-10">{card.title}</h3>
              <Link to={card.link} className="mt-auto text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 transition-colors z-10 w-fit">
                {t('admin.overview.details')} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('admin.overview.quickActions')}</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-3">
            <Link to="/admin/projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 p-2 rounded-lg group-hover:scale-110 transition-transform"><Briefcase className="w-5 h-5" /></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">{t('admin.overview.addNewProject')}</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform"><Clock className="w-5 h-5" /></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">{t('admin.overview.viewPendingOrders')}</span>
            </Link>
            <Link to="/admin/services" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform"><Wrench className="w-5 h-5" /></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">{t('admin.overview.addNewService')}</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.overview.recentActivity')}</h2>
            <Link to="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-semibold">{t('admin.overview.details')}</Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">لا توجد أنشطة حديثة</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentOrders.map((order, i) => (
                  <div key={i} className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-4">
                    <div className={`p-2.5 rounded-full shrink-0 ${
                      order.status === 'new' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/40' : 
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40'
                    }`}>
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        طلب {order.service_type} من <span className="text-amber-600">{order.customer_name}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{order.description}</p>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 whitespace-nowrap" dir="ltr">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
