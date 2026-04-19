import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-white/5 pt-24 pb-12 transition-colors">
    <div className="max-w-[1920px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
      <div className="col-span-1 md:col-span-1">
        <Link to="/" className="flex items-center gap-3 font-display font-black text-2xl tracking-tight mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-xl shadow-primary-500/20"><span className="material-symbols-rounded text-3xl">school</span></div>
          BrainLoom
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 max-w-xs font-medium">The hub for professional engineering excellence. We craft deep technical tracks that bridge the gap between basics and mastery.</p>
      </div>
      <div className="space-y-8">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mastery Tracks</h4>
        <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-300">
          <li><Link to="/explore" className="hover:text-primary-600 transition-colors">Explore All</Link></li>
        </ul>
      </div>
      <div className="space-y-8">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Our Company</h4>
        <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-300">
          <li><Link to="/" className="hover:text-primary-600 transition-colors">About BrainLoom</Link></li>
        </ul>
      </div>
      <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[32px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-primary-600/20">
        <div className="relative z-10">
          <h4 className="text-2xl font-black mb-4 font-display">Elite Access</h4>
          <p className="text-white/80 text-sm mb-8 font-medium leading-relaxed">Unlock the full platform with a premium plan.</p>
          <button className="w-full py-4 bg-white text-primary-700 font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl shadow-xl hover:scale-105 transition-all">Upgrade Experience</button>
        </div>
        <span className="material-symbols-rounded absolute -right-10 -bottom-10 text-white/10 text-[200px] select-none">verified_user</span>
      </div>
    </div>
    <div className="max-w-[1920px] mx-auto px-6 pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
      <p>&copy; 2024 BrainLoom.in For Engineering Minds.</p>
    </div>
  </footer>
);
