import { useState, useCallback, useEffect } from 'react';
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Save handler with error handling and backup
  const saveConversations = useCallback((convs: BusinessPrompt[]) => {
    try {
      // Create backup of previous state
      const currentData = localStorage.getItem(STORAGE_KEY);
      if (currentData) {
        localStorage.setItem(BACKUP_KEY, currentData);
      }

      // Save new state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
      setLastSaved(new Date());
      console.log('Conversations saved successfully');
    } catch (error) {
      console.error('Error saving conversations:', error);
      setError('Failed to save your conversation. Please copy any important information.');
    }
  }, []);

  // Load conversations with error recovery
  const loadConversations = useCallback(() => {
    try {
      // Try to load main storage
      const savedConversations = localStorage.getItem(STORAGE_KEY);
      const savedActive = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
      
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt)
        }));
        setConversations(parsed);
        
        // Restore active conversation if it exists
        if (savedActive && parsed.some((conv: BusinessPrompt) => conv.id === savedActive)) {
          setActiveConversation(savedActive);
        }
      }
    } catch (error) {
      console.error('Error loading main storage:', error);
      try {
        // Try to recover from backup
        const backup = localStorage.getItem(BACKUP_KEY);
        if (backup) {
          const parsed = JSON.parse(backup).map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt)
          }));
          setConversations(parsed);
          setError('Recovered from backup. Some recent changes might be missing.');
        }
      } catch (backupError) {
        console.error('Error loading backup:', backupError);
        setError('Could not load your conversation history. Starting fresh.');
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
      setLastSaved(null);
      setError(null);
      console.log('All stored data cleared successfully');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (conversations.length > 0) {
        saveConversations(conversations);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [conversations, saveConversations]);

  // Persist active conversation
  useEffect(() => {
    if (activeConversation) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversation);
    } else {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
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
    lastSaved,
    error,
    setError,
    saveConversations,
    clearStoredData
  };
} 