import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRootTopics } from '../services/api';
import { Topic } from '../types';
import { Footer } from '../components/layout/Footer';

export const Home = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => { 
    setLoading(true); 
    fetchRootTopics().then(res => setTopics(res.topics)).finally(() => setLoading(false)); 
  }, []);

  const filteredTopics = useMemo(() => 
    topics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())), 
  [topics, searchQuery]);

  return (
    <div className="animate-fade-in transition-colors duration-300">
      <section className="relative pt-44 pb-48 px-6 overflow-hidden bg-white dark:bg-dark-bg transition-colors text-center">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 border border-primary-100 dark:border-primary-800 animate-fade-in"><span className="material-symbols-rounded text-sm">rocket_launch</span> Pioneering The Future of Education</div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white font-display tracking-tighter leading-[0.95] mb-12">Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 animate-gradient">Technical IQ</span></h1>
          <div className="max-w-3xl mx-auto relative group scale-100 hover:scale-[1.02] transition-transform duration-500"><div className="relative flex items-center bg-white dark:bg-dark-surface p-3 rounded-[24px] shadow-2xl border border-gray-100 dark:border-white/5"><span className="material-symbols-rounded ml-6 text-gray-400 text-3xl">search</span><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="What skill do you want to master?" className="flex-1 bg-transparent border-none outline-none px-6 py-6 font-bold text-xl dark:text-white" /><button onClick={() => navigate('/explore')} className="hidden md:block px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl transition-all">Discover</button></div></div>
        </div>
      </section>
      <section className="max-w-[1920px] mx-auto px-6 py-32"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">{loading ? [1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 rounded-[40px] animate-pulse" />) : filteredTopics.slice(0, 4).map(t => <Link key={t.id} to={`/topic/${t.slug}`} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-white/5 rounded-[40px] overflow-hidden hover:-translate-y-4 transition-all duration-700 h-full flex flex-col group p-10"><h3 className="text-2xl font-black mb-4 font-display text-gray-900 dark:text-white leading-tight">{t.title}</h3><p className="text-gray-500 dark:text-gray-400 line-clamp-2 mb-10 leading-relaxed font-medium">{t.description || 'Master the essential concepts.'}</p><div className="mt-auto flex items-center justify-between text-primary-600 text-[9px] font-black uppercase tracking-[0.3em] border-t border-gray-50 dark:border-white/5 pt-8 group-hover:text-primary-500 transition-all">Initiate Path <span className="material-symbols-rounded text-lg group-hover:translate-x-2 transition-transform">east</span></div></Link>)}</div></section>
      <Footer />
    </div>
  );
};
