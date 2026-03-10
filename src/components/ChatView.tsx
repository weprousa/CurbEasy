
import React, { useState, useEffect, useRef } from 'react';
import { Message, Theme } from '../types';
import { askNYCStreetRules } from '../services/geminiService';
import Markdown from 'react-markdown';

interface ChatViewProps {
  initialPrompt: string;
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
  locationContext?: string;
  theme: Theme;
}

const ChatView: React.FC<ChatViewProps> = ({ initialPrompt, history, setHistory, onBack, locationContext, theme }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);

  useEffect(() => {
    if (initialPrompt && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await askNYCStreetRules(text, locationContext);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
    setHistory(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className={`flex flex-col h-[calc(100dvh-64px)] transition-colors ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`flex items-center p-4 border-b transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
        <button onClick={onBack} className={`mr-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>CurbEasy Assistant</h2>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {history.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? theme === 'colorful' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-primary text-white' 
                : theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-slate-200' : 'bg-white border text-slate-800'
            }`}>
              <div className={`markdown-body prose prose-sm max-w-none ${
                (msg.role === 'user' || theme === 'dark') ? 'prose-invert' : ''
              }`}>
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`border p-4 rounded-2xl flex items-center gap-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className={`p-4 border-t transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className={`flex-grow border-none rounded-xl px-4 py-3 text-sm focus:ring-2 transition-colors ${
              theme === 'dark' ? 'bg-slate-900 text-white focus:ring-blue-500' : 'bg-slate-100 text-slate-700 focus:ring-primary'
            }`}
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className={`p-3 rounded-xl disabled:opacity-50 transition-colors ${
              theme === 'colorful' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 
              'bg-primary hover:bg-primary-dark'
            } text-white`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
