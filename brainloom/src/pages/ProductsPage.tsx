import { Footer } from '../components/layout/Footer';

export const ProductsPage = () => (
    <div className="min-h-screen pt-32 pb-32 animate-fade-in bg-white dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
            <h1 className="text-5xl font-black font-display tracking-tight mb-6">Expert Ecosystem</h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Specialized tools designed to amplify your technical output and streamline your discovery process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
            <div className="p-10 rounded-[48px] bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-2xl flex flex-col h-full relative overflow-hidden group">
                <div className="relative z-10 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-8 shadow-xl">
                        <span className="material-symbols-rounded text-3xl">quiz</span>
                    </div>
                    <h2 className="text-3xl font-black mb-4 font-display tracking-tight leading-tight">Technical Quizzes</h2>
                    <p className="text-white/80 mb-12 text-sm leading-relaxed font-medium">Expert-vetted assessments tailored for system design, algorithms, and infrastructure mastery.</p>
                </div>
                <button className="relative z-10 px-8 py-5 bg-white text-primary-700 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">Launch Terminal</button>
            </div>
            <div className="p-10 rounded-[48px] bg-dark-surface border border-gray-100 dark:border-white/10 shadow-2xl flex flex-col h-full relative overflow-hidden group">
                <div className="relative z-10 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-8 shadow-xl">
                        <span className="material-symbols-rounded text-3xl">description</span>
                    </div>
                    <h2 className="text-3xl font-black mb-4 font-display tracking-tight leading-tight text-white">ATS Resume Engine</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-12 text-sm leading-relaxed font-medium">Engineering-focused resumes optimized for automated tracking systems and top-tier tech screening.</p>
                </div>
                <button className="relative z-10 px-8 py-5 bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">Initialize Builder</button>
            </div>
        </div>
        <Footer />
    </div>
);
