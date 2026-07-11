import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatbotMessageApi } from '../../services/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Welcome to SkillCite, your specialist recruitment and engineering services partner! We provide talent placement in Engineering, Accounting, and Administration, alongside drafting services like AutoCAD shop drawings, cost estimation, and structural calculations.\n\nYou can ask me about our recruitment services, specialty divisions, or how the hiring process works! To get started, you can also head directly to /request-talent if you're looking to hire, or /submit-your-cv if you're looking for opportunities." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Send last 6 messages for context
      const res = await sendChatbotMessageApi(updatedMessages.slice(-6));
      if (res.success && res.data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      } else {
        throw new Error('Invalid server reply');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a hard time answering right now. Please navigate to /contact or write to us directly at admin@skillcite.com!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-96 h-[500px] rounded-3xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-purple-950 text-white p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold font-display">SkillCite Assistant</span>
                <span className="text-[10px] opacity-75">Online • AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-bg-page scrollbar-hide">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-center gap-1.5 p-3 rounded-2xl border border-border bg-white text-muted max-w-[85%] rounded-bl-none shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-950 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-950 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-950 animate-bounce"></span>
                </motion.div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-bg-page border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-purple-950 text-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-purple-950 text-white hover:bg-slate-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circle trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-purple-950 text-white flex items-center justify-center shadow-xl hover:bg-slate-600 transition-colors focus:outline-none"
        data-cursor="expand"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
