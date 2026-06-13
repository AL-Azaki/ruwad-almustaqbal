import { useState, useEffect } from 'react';
import { Maximize2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import api from '../lib/api';

interface ProjectType {
  id: number;
  title: string;
  category: string;
  image_path: string | null;
  description: string;
}

export default function Portfolio() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(t('portfolio.all'));
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  // We have to hardcode or map categories based on DB if they differ,
  // For simplicity, we just extract unique categories from the data.
  const [categories, setCategories] = useState<string[]>([t('portfolio.all')]);

  useEffect(() => {
    api.get('/projects')
      .then(response => {
        setProjects(response.data);
        const uniqueCats = Array.from(new Set(response.data.map((p: any) => p.category))) as string[];
        setCategories([t('portfolio.all'), ...uniqueCats]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching projects", error);
        setLoading(false);
      });
  }, [t]);

  const filteredProjects = activeCategory === t('portfolio.all') 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white dark:bg-gray-900 py-16 min-h-screen transition-colors duration-300">
      <Helmet>
        <title>معرض الأعمال | رواد المستقبل - مشاريعنا في جدة</title>
        <meta name="description" content="تصفح معرض أعمال شركة رواد المستقبل في جدة للخدمات التقنية: مشاريع تركيب كاميرات، تمديد شبكات، وتأسيس كهرباء بأحدث التقنيات." />
        <meta name="keywords" content="معرض أعمال, سابقة أعمال, مشاريع تقنية, مشاريع شبكات, كاميرات مراقبة, جدة, رواد المستقبل" />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {t('portfolio.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">{t('portfolio.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gray-900 dark:bg-amber-500 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const getImageUrl = (path: string | null) => {
                if (!path) return null;
                if (path.startsWith('http')) return path;
                if (path.startsWith('/storage')) {
                  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
                  return `${baseUrl}${path}`;
                }
                return path;
              };
              const imageUrl = getImageUrl(project.image_path);
              const isVideo = imageUrl && /\.(mp4|webm|ogg|mov)$/i.test(imageUrl.split('?')[0]);
              
              return (
              <div 
                key={project.id} 
                className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer h-80 bg-gray-100 dark:bg-gray-800"
              >
                {/* Image or Video */}
                {imageUrl ? (
                  isVideo ? (
                    <video 
                      src={imageUrl} 
                      controls 
                      playsInline 
                      className="w-full h-full object-contain bg-black"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : (
                    <img 
                      src={imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  )
                ) : null}
                
                {/* Fallback View */}
                <div className={`w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium ${imageUrl ? 'hidden' : 'flex'}`}>
                  {t('portfolio.comingSoon')}
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                  <span className="text-amber-400 font-medium text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                    {project.description}
                  </p>
                </div>

                {/* View Icon */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
              );
            })}
          </div>
        )}
        
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            {t('portfolio.empty')}
          </div>
        )}

      </div>
    </div>
  );
}
