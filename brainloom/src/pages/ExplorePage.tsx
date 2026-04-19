import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRootTopics } from '../services/api';
import { Topic } from '../types';
import { Footer } from '../components/layout/Footer';
import { AuthContext } from '../contexts/AuthContext';
import { AddTopicModal } from '../components/features/AddTopicModal';
import { useContext } from 'react';

export const ExplorePage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    fetchRootTopics().then(res => setTopics(res.topics)).finally(() => setLoading(false)); 
  }, []);

  const { isAdmin } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTopicCreated = (newTopic: any) => {
    setIsModalOpen(false);
    // Add logic to redirect or refresh if desired, simple refresh is easiest
    window.location.href = `/topic/${newTopic.slugPath}`;
  };

  return (
    <div className="min-h-screen pt-32 pb-32 animate-fade-in bg-white dark:bg-dark-bg transition-colors"><div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
        <h1 className="text-5xl font-black font-display tracking-tight text-center md:text-left">Knowledge Directory</h1>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl transition-all flex items-center gap-3">
            <span className="material-symbols-rounded">add</span> Create Track
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{loading ? [1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />) : topics.map(t => <Link key={t.id} to={`/topic/${t.slug}`} className="p-8 rounded-[32px] bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-dark-surface hover:shadow-2xl transition-all group flex flex-col h-full"><h3 className="text-xl font-black mb-4 font-display">{t.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-8">{t.description}</p><div className="mt-auto text-primary-600 text-[9px] font-black uppercase tracking-widest flex items-center justify-between">Explore Track <span className="material-symbols-rounded text-base">arrow_forward</span></div></Link>)}</div>
      
      {isModalOpen && (
        <AddTopicModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleTopicCreated}
          orderNo={topics.length} 
        />
      )}
      
      </div><Footer /></div>
  );
};
