import { useState } from 'react';
import { motion } from 'framer-motion';
import TypewriterComponent from 'typewriter-effect';
import { Message } from '../types';
import { TYPING_SPEED } from '../constants';

interface AnimatedMessageProps {
  message: Message;
  role: string;
}

export function AnimatedMessage({ message, role }: AnimatedMessageProps) {
  const [isTyping, setIsTyping] = useState(true);
  const [displayContent, setDisplayContent] = useState('');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
                  .typeString(message.content)
                  .callFunction(() => {
                    setIsTyping(false);
                    setDisplayContent(message.content);
                  })
                  .start();
              }}
              options={{
                delay: TYPING_SPEED,
                cursor: '|',
                wrapperClassName: "text-sm whitespace-pre-wrap leading-relaxed"
              }}
            />
          ) : (
            <div>
              {displayContent.split('\n\n').map((paragraph, i) => (
                <span key={i} className="block mb-4 last:mb-0">
                  {paragraph.startsWith('•') ? (
                    <span className="block pl-4 -indent-4 text-indigo-700">{paragraph}</span>
                  ) : (
                    paragraph
                  )}
                </span>
              ))}
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