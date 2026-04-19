import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchTopicBySlug, saveTopicContent } from '../services/api';
import { RichContent } from '../components/features/RichContent';
import { TopicDetailResponse, EditorBlock, BlockType } from '../types';
import { 
  Toolbar, BlockActions, TextBlock, CodeBlock, MultiCodeBlock, NoteBlock, ImageBlock, CarouselBlock 
} from '../components/features/EditorElements';
import { htmlToBlocks, blocksToHtml } from '../utils/editorUtils';
import { AuthContext } from '../contexts/AuthContext';
import { Footer } from '../components/layout/Footer';
import { AddTopicModal } from '../components/features/AddTopicModal';

const Breadcrumbs = ({ slugPath }: { slugPath: string }) => {
  const segments = slugPath.split('/').filter(Boolean);
  let currentPath = '/topic';
  return (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 overflow-x-auto no-scrollbar whitespace-nowrap opacity-60">
      <Link to="/" className="text-gray-400 hover:text-primary-600 transition-colors">Platform</Link>
      <span className="text-gray-300">/</span>
      {segments.map((segment, idx) => {
        currentPath += `/${segment}`;
        const isLast = idx === segments.length - 1;
        const label = segment.replace(/-/g, ' ');
        return (
          <React.Fragment key={currentPath}>
            {isLast ? <span className="text-primary-600 truncate max-w-[150px]">{label}</span> : <><Link to={currentPath} className="text-gray-400 hover:text-primary-600 transition-colors truncate max-w-[150px]">{label}</Link><span className="text-gray-300">/</span></>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const TopicViewer = () => {
  const { "*": slug } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const [data, setData] = useState<TopicDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editorBlocks, setEditorBlocks] = useState<EditorBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTopic = () => {
    if (!slug) return;
    setLoading(true);
    fetchTopicBySlug(slug).then(res => {
      setData(res);
      const initialBlocks = res.blocks.length > 0 ? htmlToBlocks(res.blocks[0].components[0]?.json.content || '') : [{ id: 'init', type: 'text' as BlockType, content: '' }];
      setEditorBlocks(initialBlocks);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadTopic(); }, [slug]);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const html = blocksToHtml(editorBlocks);
      await saveTopicContent(data.topic.id, html, data.blocks[0]?.id);
      setIsEditMode(false);
      loadTopic();
    } catch (e) { alert('Save failed'); } finally { setIsSaving(false); }
  };

  const handleSubtopicCreated = (newTopic: any) => {
    setIsModalOpen(false);
    window.location.href = `/topic/${newTopic.slugPath}`;
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary-600 font-black tracking-widest uppercase text-xs">Synchronizing Knowledge...</div>;
  if (!data) return <div className="p-20 text-center text-red-500 font-bold">Track not found.</div>;

  const NavigationList = () => {
    const sorted = data.children?.sort((a,b) => a.order_no - b.order_no) || [];
    return (
      <div className="space-y-1">
        {sorted.map((child, idx) => (
          <Link key={child.id} to={`/topic/${slug}/${child.slug}`} className="flex items-center gap-4 p-4 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-dark-surface hover:text-primary-600 transition-all border border-transparent hover:border-gray-100 dark:hover:border-dark-border group">
            <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-bg flex items-center justify-center text-[10px] font-black group-hover:bg-primary-600 group-hover:text-white transition-all">{idx + 1}</span>
            <span className="truncate flex-1">{child.title}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 pt-20">
      <div className="max-w-[1920px] mx-auto px-4 py-12 border-b border-gray-100 dark:border-dark-border mb-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <Breadcrumbs slugPath={slug || ''} />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-display leading-tight tracking-tight">{data.topic.title}</h1>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl">Add Subtopic</button>
              <button onClick={() => setIsEditMode(!isEditMode)} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 transition-colors text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl">{isEditMode ? 'Cancel' : 'Edit Page'}</button>
              {isEditMode && <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl">{isSaving ? 'Saving...' : 'Save'}</button>}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          <div className="flex-1 min-w-0">
            {isEditMode ? (
              <div className="max-w-4xl mx-auto p-8 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-dark-bg min-h-[500px]">
                <Toolbar onAddBlock={(type) => setEditorBlocks([...editorBlocks, { id: Math.random().toString(36).substr(2, 9), type, content: '' }])} />
                <div className="space-y-4">
                  {editorBlocks.map((block, idx) => (
                    <div key={block.id} className="group relative">
                      <BlockActions onDelete={() => setEditorBlocks(editorBlocks.filter(b => b.id !== block.id))} onMoveUp={() => {}} onMoveDown={() => {}} isFirst={idx === 0} isLast={idx === editorBlocks.length-1} />
                      <TextBlock block={block} onChange={u => setEditorBlocks(editorBlocks.map(x => x.id === u.id ? u : x))} />
                    </div>
                  ))}
                </div>
              </div>
            ) : <RichContent htmlContent={data.blocks[0]?.components[0]?.json.content || ''} />}
          </div>
          <aside className="hidden lg:block w-72 sticky top-28 h-fit bg-gray-50/50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Topic Hierarchy</h3>
            <NavigationList />
          </aside>
        </div>
      </div>
      <Footer />
      {isModalOpen && data && (
        <AddTopicModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleSubtopicCreated}
          parentId={data.topic.id}
          parentPath={slug}
          orderNo={data.children?.length || 0}
        />
      )}
    </div>
  );
};
