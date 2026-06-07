import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Star, 
  Zap, Wifi, Camera, Droplets, 
  Lightbulb, PaintRoller, PenTool, Image as ImageIcon,
  PhoneCall, Search, Settings, ShieldCheck, Quote,
  MessageSquarePlus, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface ProjectType {
  id: number;
  title: string;
  category: string;
  image_path: string | null;
  description: string;
  updated_at?: string;
}

interface TestimonialType {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isAr = i18n.language === 'ar';
  
  // Projects State
  const [projects, setProjects] = useState<ProjectType[]>(() => {
    const cached = localStorage.getItem('home_projects');
    return cached ? JSON.parse(cached) : [];
  });
  const [loadingProjects, setLoadingProjects] = useState(!projects.length);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isReviewSuccess, setIsReviewSuccess] = useState(false);

  useEffect(() => {
    // Fetch Projects
    api.get('/projects')
      .then(response => {
        const latestProjects = response.data.slice(0, 8);
        setProjects(latestProjects);
        localStorage.setItem('home_projects', JSON.stringify(latestProjects));
        setLoadingProjects(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProjects(false);
      });

    // Fetch Approved Testimonials
    api.get('/testimonials')
      .then(response => {
        setTestimonials(response.data);
        setLoadingTestimonials(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingTestimonials(false);
      });
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    
    setSubmittingReview(true);
    try {
      await api.post('/testimonials', reviewForm);
      setIsReviewSuccess(true);
      setReviewForm({ name: '', role: '', text: '', rating: 5 });
    } catch (err) {
      toast.error('حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const serviceCategories = [
    { key: 'electrical', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { key: 'network', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { key: 'surveillance', icon: Camera, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { key: 'plumbing', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
    { key: 'lighting', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { key: 'interior', icon: PaintRoller, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { key: 'additional', icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ];

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000" 
            alt="Background" 
            className="w-full h-full object-cover opacity-60 animate-kenburns" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <span className="inline-block py-2 px-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm mb-6 border border-amber-500/30 backdrop-blur-sm shadow-lg shadow-amber-500/10 animate-fade-in-up">
            {t('home.badge')}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            {t('home.title')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{t('home.titleHighlight')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/contact" className="bg-amber-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/50 hover:-translate-y-1 flex items-center justify-center gap-2">
              {t('home.cta')}
              <ArrowLeft className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
            </Link>
            <Link to="/services" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md transition-all flex items-center justify-center">
              {t('home.explore')}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Detailed Services Grid (Moved Up for better UX) */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('home.detailedServices.title')} <span className="text-amber-500">{t('home.detailedServices.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('home.detailedServices.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {serviceCategories.map((cat, idx) => {
              const Icon = cat.icon;
              const title = t(`home.detailedServices.cats.${cat.key}.title`) as string;
              const items = t(`home.detailedServices.cats.${cat.key}.items`, { returnObjects: true }) as string[];

              return (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                  </h3>
                  <ul className="space-y-3">
                    {items && items.length > 0 && items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${cat.color}`} />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How We Work Section (Our Process) */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50/50 to-transparent dark:from-amber-900/5 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-blue-900/5 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-3 block">{t('home.howWeWork.subtitle')}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">{t('home.howWeWork.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('home.howWeWork.desc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative max-w-7xl mx-auto">
            {/* Animated Dashed Connecting Line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-gray-200 dark:border-gray-700 z-0"></div>
            
            {[
              { title: t('home.howWeWork.steps.s1.title'), desc: t('home.howWeWork.steps.s1.desc'), icon: PhoneCall, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-white dark:bg-gray-800', border: 'border-blue-100 dark:border-blue-900/50', hover: 'hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/50' },
              { title: t('home.howWeWork.steps.s2.title'), desc: t('home.howWeWork.steps.s2.desc'), icon: Search, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-white dark:bg-gray-800', border: 'border-amber-100 dark:border-amber-900/50', hover: 'hover:shadow-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/50' },
              { title: t('home.howWeWork.steps.s3.title'), desc: t('home.howWeWork.steps.s3.desc'), icon: Settings, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-white dark:bg-gray-800', border: 'border-emerald-100 dark:border-emerald-900/50', hover: 'hover:shadow-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/50' },
              { title: t('home.howWeWork.steps.s4.title'), desc: t('home.howWeWork.steps.s4.desc'), icon: ShieldCheck, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-white dark:bg-gray-800', border: 'border-purple-100 dark:border-purple-900/50', hover: 'hover:shadow-purple-500/20 hover:border-purple-300 dark:hover:border-purple-500/50' }
            ].map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                {/* Step Number Badge */}
                <div className={`absolute top-0 right-1/2 translate-x-[60%] -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-bold shadow-lg z-20 border-4 border-white dark:border-gray-900 transition-transform duration-300 group-hover:scale-110`}>
                  {index + 1}
                </div>
                
                {/* Icon Container */}
                <div className={`w-24 h-24 rounded-full ${step.bg} ${step.color} border-4 ${step.border} flex items-center justify-center mb-8 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${step.hover} relative bg-white dark:bg-gray-800 z-10`}>
                  <step.icon className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                
                {/* Content */}
                <div className={`bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 w-full flex-grow transition-all duration-300 shadow-sm ${step.hover}`}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Scrollable Projects Carousel */}
      <section className="bg-white dark:bg-gray-900 py-16 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('home.projects.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('home.projects.subtitle')}</p>
        </div>
        
        <div className="w-full px-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar w-full max-w-7xl mx-auto">
            {loadingProjects && projects.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="relative w-72 sm:w-80 h-56 rounded-3xl overflow-hidden shadow-xl shrink-0 snap-center border border-gray-200 dark:border-gray-700 animate-pulse bg-gray-300 dark:bg-gray-700">
                  <div className="absolute bottom-5 right-5 w-1/3 h-6 bg-gray-400/50 dark:bg-gray-600 rounded-full mb-3"></div>
                  <div className="absolute bottom-5 right-5 w-2/3 h-8 bg-gray-400/50 dark:bg-gray-600 rounded mt-10"></div>
                </div>
              ))
            ) : projects.length === 0 && !loadingProjects ? (
              <div className="w-full text-center text-gray-500 dark:text-gray-400 py-10 font-bold">{t('home.projects.empty')}</div>
            ) : (
              projects.map((project, i) => {
                const getImageUrl = (path: string | null) => {
                  if (!path) return null;
                  if (path.startsWith('http')) return path;
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
                <Link to="/portfolio" key={i} className="relative w-72 sm:w-80 h-56 rounded-3xl overflow-hidden shadow-xl shrink-0 snap-center group/card block border border-white/20 dark:border-gray-700">
                  {imageUrl ? (
                    isVideo ? (
                      <video src={imageUrl} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 pointer-events-none" />
                    ) : (
                      <img src={imageUrl} alt={project.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90 pointer-events-none"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-right pointer-events-none">
                    <span className="inline-block px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">{project.title}</h3>
                  </div>
                </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Snap Carousel */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/80 transition-colors duration-300 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-right">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{t('home.testimonials.title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('home.testimonials.subtitle')}</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <MessageSquarePlus className="w-5 h-5" /> {t('home.testimonials.addBtn')}
            </button>
          </div>
          
          <div className="w-full relative">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar w-full max-w-7xl mx-auto px-4 relative z-10">
              {loadingTestimonials ? (
                // Skeleton Testimonials
                [...Array(3)].map((_, i) => (
                  <div key={i} className="w-80 md:w-96 p-8 rounded-3xl shrink-0 snap-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md animate-pulse h-64 border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                ))
              ) : testimonials.length === 0 ? (
                <div className="w-full text-center text-gray-500 dark:text-gray-400 py-12 font-bold text-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  {t('home.testimonials.empty')}
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-80 md:w-[400px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 shrink-0 snap-center relative flex flex-col transition-all duration-300 hover:-translate-y-2 group">
                    <Quote className="absolute top-6 left-6 w-16 h-16 text-amber-500/10 dark:text-amber-400/5 rotate-180 z-0 transition-transform duration-300 group-hover:scale-110" />
                    <div className="relative z-10 flex-grow">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-4 h-4 ${j < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('home.testimonials.verified')}</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 mb-8 text-lg leading-loose font-medium">"{testimonial.text}"</p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-2xl shadow-md ring-4 ring-white dark:ring-gray-800">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{testimonial.role || 'عميل مميز'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{t('home.features.f1Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('home.features.f1Desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{t('home.features.f2Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('home.features.f2Desc')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{t('home.features.f3Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('home.features.f3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini CTA */}
      <section className="py-20 bg-gray-900 dark:bg-black text-white text-center transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">{t('home.emergencyTitle')}</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">{t('home.emergencyDesc')}</p>
          <a href={`https://wa.me/${(settings?.whatsappNumber || '966506396004').replace('+', '')}`} target="_blank" rel="noreferrer" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all">
            {t('home.emergencyBtn')}
          </a>
        </div>
      </section>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {isReviewSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">شكراً لك!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  تم استلام تقييمك بنجاح. سيقوم فريق الإدارة بمراجعته قريباً ثم سيتم نشره في الموقع. نحن نقدر ثقتك بنا!
                </p>
                <button 
                  onClick={() => {
                    setIsReviewSuccess(false);
                    setIsModalOpen(false);
                  }}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl shadow-md transition-all hover:-translate-y-1"
                >
                  حسناً، إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">الاسم <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="اسمك الكريم"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">المسمى (اختياري)</label>
                  <input 
                    type="text" 
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({...reviewForm, role: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="مثال: مالك فيلا، شركة كذا..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">التقييم</label>
                  <div className="flex gap-2 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`w-8 h-8 transition-colors ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold text-sm">رأيك <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    rows={4}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="اكتب تجربتك معنا هنا..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'جاري الإرسال...' : 'إرسال الرأي'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
