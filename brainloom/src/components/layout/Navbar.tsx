import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';

export const Navbar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] h-20 glass border-b border-gray-200 dark:border-white/5 px-8">
      <div className="max-w-[1920px] mx-auto w-full h-full flex items-center justify-between">
        <div className="flex items-center gap-16">
            <Link to="/" className="flex items-center gap-3 font-display font-black text-2xl tracking-tighter">
                <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20"><span className="material-symbols-rounded">school</span></div>
                <span className="hidden lg:block">BrainLoom</span>
            </Link>
            <div className="hidden md:flex gap-12">
                <Link to="/explore" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/explore' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Explore Directory</Link>
                <Link to="/products" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname.startsWith('/products') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Intelligence Ecosystem</Link>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-3 text-gray-500 hover:text-primary-600 transition-colors">
                <span className="material-symbols-rounded text-2xl">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="w-px h-6 bg-gray-100 dark:bg-white/10 hidden sm:block"></div>
            {user ? <Link to="/profile" className="text-[10px] font-black uppercase tracking-widest">Control Center</Link> : <Link to="/login" className="px-10 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl">Login Portal</Link>}
        </div>
      </div>
    </nav>
  );
};
