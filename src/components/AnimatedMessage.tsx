import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TypewriterComponent from 'typewriter-effect';
import { Message } from '../types';
import { TYPING_SPEED } from '../constants';

interface AnimatedMessageProps {
  message: Message;
  role: string;
  isNewMessage?: boolean;
}

export function AnimatedMessage({ message, role, isNewMessage = false }: AnimatedMessageProps) {
  const [isTyping, setIsTyping] = useState(isNewMessage);
  const [displayContent, setDisplayContent] = useState(isNewMessage ? '' : message.content);
  
  useEffect(() => {
    setIsTyping(isNewMessage);
    setDisplayContent(isNewMessage ? '' : message.content);
  }, [message.content, isNewMessage]);

  const renderContent = () => {
    return displayContent.split('\n\n').map((paragraph, i) => (
      <span key={i} className="block mb-4 last:mb-0">
        {paragraph.startsWith('•') ? (
          <span className="block pl-4 -indent-4 text-indigo-700">{paragraph}</span>
        ) : (
          paragraph
        )}
      </span>
    ));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg ${
        role === 'user' 
          ? 'bg-purple-50 ml-auto max-w-[80%] border border-purple-100' 
          : 'bg-indigo-50 mr-auto max-w-[80%] border border-indigo-100'
      }`}
    >
      {role === 'assistant' ? (
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {isTyping ? (
            <TypewriterComponent
              onInit={(typewriter) => {
                typewriter
                  .changeDelay(TYPING_SPEED * 0.4)
                  .typeString(message.content)
                  .callFunction(() => {
                    setIsTyping(false);
                    setDisplayContent(message.content);
                  })
                  .start();
              }}
              options={{
                cursor: '|',
                wrapperClassName: "text-sm whitespace-pre-wrap leading-relaxed"
              }}
            />
          ) : (
            <div className="animate-fadeIn">
              {renderContent()}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      )}
    </motion.div>
  );
} 