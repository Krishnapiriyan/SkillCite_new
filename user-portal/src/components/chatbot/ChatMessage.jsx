import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  const renderContent = (content) => {
    if (isUser) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    // Match path patterns like /request-talent, /submit-your-cv, /engineering-services, /contact
    const pathRegex = /(\/(?:request-talent|submit-your-cv|engineering-services|contact))/g;
    const parts = content.split(pathRegex);

    if (parts.length === 1) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    return (
      <p className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, index) => {
          if (part.match(pathRegex)) {
            let linkLabel = part;
            if (part === '/request-talent') linkLabel = 'Request Talent';
            if (part === '/submit-your-cv') linkLabel = 'Submit CV';
            if (part === '/engineering-services') linkLabel = 'Engineering Services';
            if (part === '/contact') linkLabel = 'Contact Us';

            return (
              <Link
                key={index}
                to={part}
                className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md bg-purple-950 text-white border border-purple-950 font-bold hover:bg-purple-700 hover:text-white transition-all text-[11px] sm:text-xs select-none"
              >
                {linkLabel}
              </Link>
            );
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm
          ${isUser 
            ? 'bg-purple-950 text-white rounded-br-none' 
            : 'bg-white text-primary border border-border rounded-bl-none'
          }`}
      >
        {renderContent(message.content)}
      </div>
    </motion.div>
  );
}
