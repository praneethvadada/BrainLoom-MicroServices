import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Footer } from '../components/layout/Footer';

export const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen pt-32 pb-32 animate-fade-in bg-white dark:bg-dark-bg transition-colors">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-gray-50 dark:bg-dark-surface rounded-[64px] p-16 shadow-2xl flex flex-col md:flex-row items-center gap-12 border border-gray-100 dark:border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/5 blur-[100px] rounded-full"></div>
                    <div className="w-40 h-40 rounded-[48px] bg-primary-600 text-white flex items-center justify-center text-6xl font-black shadow-2xl relative z-10">{user.name.charAt(0)}</div>
                    <div className="flex-1 text-center md:text-left relative z-10">
                        <h1 className="text-5xl font-black font-display mb-3 tracking-tight">{user.name}</h1>
                        <p className="text-lg text-gray-500 font-medium mb-8">{user.email}</p>
                        <button onClick={() => { logout(); navigate('/'); }} className="px-10 py-4 bg-red-50 dark:bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-red-100 transition-all shadow-xl">Terminate Session</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
