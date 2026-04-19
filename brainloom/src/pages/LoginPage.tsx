import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLoading(true); 
    try { 
      const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
      const pwd = (e.currentTarget.elements[1] as HTMLInputElement).value;
      await loginUser(email, pwd); 
      navigate('/'); 
    } catch { 
      alert('Authentication failed.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-dark-bg transition-colors pt-32">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface p-14 rounded-[56px] shadow-2xl space-y-12 border border-gray-100 dark:border-white/5 w-full max-w-md">
            <div className="text-center"><h1 className="text-4xl font-black font-display tracking-tight mb-3">Admin Terminal</h1><p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Encrypted Infrastructure Login</p></div>
            <div className="space-y-6">
                <input className="w-full h-16 px-6 rounded-2xl border border-gray-100 dark:border-white/10 dark:bg-dark-bg outline-none font-bold text-lg" placeholder="Entity Email" required type="email" />
                <input className="w-full h-16 px-6 rounded-2xl border border-gray-100 dark:border-white/10 dark:bg-dark-bg outline-none font-bold text-lg" type="password" placeholder="Access Token" required />
            </div>
            <button type="submit" disabled={loading} className="w-full h-18 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl">{loading ? 'Decrypting...' : 'Verify Identity'}</button>
        </form>
    </div>
  );
};
