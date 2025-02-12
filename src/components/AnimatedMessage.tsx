import { useState, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  // Reset state when message changes
  useEffect(() => {
    setIsTyping(isNewMessage);
    setDisplayContent(isNewMessage ? '' : message.content);
    setError(null);
  }, [message.content, isNewMessage]);

  const handleTypingComplete = useCallback(() => {
    try {
      setIsTyping(false);
      setDisplayContent(message.content);
    } catch (err) {
      console.error('Error in typing completion:', err);
      setError('Failed to display message');
    }
  }, [message.content]);

  const renderContent = useCallback(() => {
    if (error) {
      return <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>;
    }

    return displayContent.split('\n\n').map((paragraph, i) => (
      <span key={i} className="block mb-4 last:mb-0">
        {paragraph.startsWith('•') ? (
          <span className="block pl-4 -indent-4 text-indigo-700 dark:text-indigo-300">{paragraph}</span>
        ) : (
          <span className="text-gray-800 dark:text-gray-100">{paragraph}</span>
        )}
      </span>
    ));
  }, [displayContent, error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg ${
        role === 'user' 
          ? 'bg-purple-50 dark:bg-purple-900/30 ml-auto max-w-[80%] border border-purple-100 dark:border-purple-800 text-gray-800 dark:text-gray-100' 
          : 'bg-indigo-50 dark:bg-indigo-900/30 mr-auto max-w-[80%] border border-indigo-100 dark:border-indigo-800 text-gray-800 dark:text-gray-100'
      }`}
    >
      {role === 'assistant' ? (
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {isTyping ? (
            <TypewriterComponent
              onInit={(typewriter) => {
                try {
                  typewriter
                    .changeDelay(TYPING_SPEED * 0.4)
                    .typeString(message.content)
                    .callFunction(handleTypingComplete)
                    .start();
                } catch (err) {
                  console.error('Error initializing typewriter:', err);
                  setError('Failed to initialize typing animation');
                  setIsTyping(false);
                  setDisplayContent(message.content);
                }
              }}
              options={{
                cursor: '|',
                wrapperClassName: "text-sm whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100"
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