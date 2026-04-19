import { EditorBlock, BlockType } from '../types';

export const blocksToHtml = (blocks: EditorBlock[]): string => {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading': return `<h2>${block.content}</h2>`;
      case 'text': return `<p>${block.content}</p>`;
      case 'code': return `<code language="${block.metadata?.language || 'javascript'}">${block.content}</code>`;
      case 'multi-code': 
        const snippets = block.metadata?.snippets?.map(s => `<snippet label="${s.label}" language="${s.language}">${s.content}</snippet>`).join('') || '';
        return `<multicode>${snippets}</multicode>`;
      case 'note': return `<note type="${block.metadata?.level || 'info'}">${block.content}</note>`;
      case 'image': return `<img src="${block.content}" alt="Image" />`;
      case 'carousel': 
        const imgs = block.metadata?.images?.map(img => `<img src="${img.url}" alt="${img.caption || ''}" />`).join('') || '';
        return `<carousel>${imgs}</carousel>`;
      default: return '';
    }
  }).join('\n');
};

export const htmlToBlocks = (html: string): EditorBlock[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: EditorBlock[] = [];
  const createId = () => Math.random().toString(36).substr(2, 9);

  Array.from(doc.body.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === 'h2') blocks.push({ id: createId(), type: 'heading', content: el.innerHTML });
      else if (tag === 'p') blocks.push({ id: createId(), type: 'text', content: el.innerHTML });
      else if (tag === 'code') blocks.push({ id: createId(), type: 'code', content: el.textContent || '', metadata: { language: el.getAttribute('language') || 'javascript' } });
      else if (tag === 'multicode') {
        const snippets = Array.from(el.querySelectorAll('snippet')).map(s => ({ id: createId(), label: s.getAttribute('label') || 'Snippet', language: s.getAttribute('language') || 'javascript', content: s.textContent || '' }));
        blocks.push({ id: createId(), type: 'multi-code', content: '', metadata: { snippets } });
      } else if (tag === 'note') blocks.push({ id: createId(), type: 'note', content: el.innerHTML, metadata: { level: (el.getAttribute('type') as any) || 'info' } });
      else if (tag === 'img' && !el.closest('carousel')) blocks.push({ id: createId(), type: 'image', content: el.getAttribute('src') || '' });
      else if (tag === 'carousel') {
        const images = Array.from(el.querySelectorAll('img')).map(img => ({ id: createId(), url: img.getAttribute('src') || '', caption: img.getAttribute('alt') || '' }));
        blocks.push({ id: createId(), type: 'carousel', content: '', metadata: { images } });
      }
    }
  });
  return blocks.length > 0 ? blocks : [{ id: createId(), type: 'text', content: '' }];
};
