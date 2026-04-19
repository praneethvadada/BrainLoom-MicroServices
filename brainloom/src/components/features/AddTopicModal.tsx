import React, { useState, useEffect } from 'react';
import { checkSlug, createTopic } from '../../services/api';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (topic: any) => void;
  parentId?: number | null;
  parentPath?: string;
  orderNo?: number;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({ 
  isOpen, onClose, onSuccess, parentId = null, parentPath = '', orderNo = 0
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from title if user hasn't manually edited it
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-update slug if it's currently matching the previous title
    // or if the slug is empty
    const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(autoSlug);
  };

  useEffect(() => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }
    
    // Debounce slug checking
    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      try {
        const available = await checkSlug(slug, parentId);
        setSlugAvailable(available);
      } catch (err) {
        setSlugAvailable(false);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [slug, parentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
       setError("Title and slug are required");
       return;
    }
    if (slugAvailable === false) {
       setError("This path slug is already taken under this parent.");
       return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const newTopic = await createTopic({
        title,
        slug,
        description,
        parent_id: parentId,
        order_no: orderNo
      });
      
      const slugPath = parentPath ? `${parentPath}/${slug}` : slug;
      onSuccess({ ...newTopic, slugPath });
    } catch (err: any) {
      setError(err.message || "Failed to create topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-bg w-full max-w-md rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-black font-display mb-6">
          {parentId ? 'Add Subtopic' : 'Create New Track'}
        </h2>
        
        {error && <div className="p-3 mb-4 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border focus:ring-2 focus:ring-primary-600 outline-none transition-all font-bold"
              placeholder="e.g. System Design Basics"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">URL Slug</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border focus:ring-2 focus:ring-primary-600 outline-none transition-all"
                placeholder="e.g. system-design"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isCheckingSlug ? (
                  <span className="material-symbols-rounded animate-spin text-gray-400">autorenew</span>
                ) : slugAvailable === true ? (
                  <span className="material-symbols-rounded text-emerald-500">check_circle</span>
                ) : slugAvailable === false && slug ? (
                  <span className="material-symbols-rounded text-red-500">cancel</span>
                ) : null}
              </div>
            </div>
            {slugAvailable === false && slug && (
              <p className="mt-1 text-xs text-red-500 font-bold">This slug is unavailable.</p>
            )}
            {parentPath && slug && (
              <p className="mt-2 text-[10px] leading-relaxed text-gray-400">
                Preview URL: <br/> <code className="text-primary-600 font-mono">/topic/{parentPath}/{slug}</code>
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-dark-border focus:ring-2 focus:ring-primary-600 outline-none transition-all min-h-[100px]"
              placeholder="Brief summary..."
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || slugAvailable === false || !title || !slug}
              className="px-6 py-3 rounded-xl font-black bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-widest"
            >
              {isSubmitting ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
