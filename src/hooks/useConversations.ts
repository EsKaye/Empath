import { useState, useCallback, useEffect, useRef } from 'react';
import { BusinessPrompt } from '../types';
import {
  STORAGE_KEY,
  BACKUP_KEY,
  ACTIVE_CONVERSATION_KEY,
  AUTO_SAVE_INTERVAL
} from '../constants';

export function useConversations() {
  const [conversations, setConversations] = useState<BusinessPrompt[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Save handler with error handling and backup
  const saveConversations = useCallback((convs: BusinessPrompt[]) => {
    try {
      if (!Array.isArray(convs)) {
        throw new Error('Invalid conversations data');
      }

      // Create backup of previous state
      const currentData = localStorage.getItem(STORAGE_KEY);
      if (currentData) {
        localStorage.setItem(BACKUP_KEY, currentData);
      }

      // Save new state
      const dataToSave = JSON.stringify(convs);
      localStorage.setItem(STORAGE_KEY, dataToSave);
      console.log('Conversations saved successfully');
    } catch (error) {
      console.error('Error saving conversations:', error);
      setError('Failed to save your conversation. Please copy any important information.');
    }
  }, []);

  // Load conversations with error recovery
  const loadConversations = useCallback(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      // Try to load main storage
      const savedConversations = localStorage.getItem(STORAGE_KEY);
      const savedActive = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
      
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        if (!Array.isArray(parsed)) {
          throw new Error('Invalid stored data format');
        }

        const validatedConversations = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          id: conv.id || Date.now().toString(),
          messages: Array.isArray(conv.messages) ? conv.messages : []
        }));

        setConversations(validatedConversations);
        
        // Restore active conversation if it exists
        if (savedActive && validatedConversations.some((conv: BusinessPrompt) => conv.id === savedActive)) {
          setActiveConversation(savedActive);
        }
      }
    } catch (error) {
      console.error('Error loading main storage:', error);
      try {
        // Try to recover from backup
        const backup = localStorage.getItem(BACKUP_KEY);
        if (backup) {
          const parsed = JSON.parse(backup);
          if (!Array.isArray(parsed)) {
            throw new Error('Invalid backup data format');
          }

          const validatedBackup = parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            id: conv.id || Date.now().toString(),
            messages: Array.isArray(conv.messages) ? conv.messages : []
          }));

          setConversations(validatedBackup);
          setError('Recovered from backup. Some recent changes might be missing.');
        }
      } catch (backupError) {
        console.error('Error loading backup:', backupError);
        setError('Could not load your conversation history. Starting fresh.');
        setConversations([]);
      }
    }
  }, []);

  // Clear all stored data
  const clearStoredData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      setConversations([]);
      setActiveConversation(null);
      setError(null);
      isInitialized.current = false;
      console.log('All stored data cleared successfully');
    } catch (error) {
      console.error('Error clearing stored data:', error);
      setError('Failed to clear data. Please try again.');
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!conversations.length) return;

    const intervalId = setInterval(() => {
      saveConversations(conversations);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [conversations, saveConversations]);

  // Persist active conversation
  useEffect(() => {
    try {
      if (activeConversation) {
        localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversation);
      } else {
        localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      }
    } catch (error) {
      console.error('Error persisting active conversation:', error);
    }
  }, [activeConversation]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    error,
    setError,
    saveConversations,
    clearStoredData
  };
} 