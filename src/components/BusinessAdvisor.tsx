import { useState, useEffect, useCallback, useRef } from 'react'
import { Button, TextField, ScrollArea } from '@radix-ui/themes'
import { analyzeSentimentAndRespond } from '../lib/mistral'
import { 
  Loader2, 
  Lightbulb, 
  AlertCircle, 
  BarChart2, 
  Users, 
  ShoppingBag, 
  Settings, 
  Heart, 
  TrendingUp, 
  Shield, 
  Laptop,
  MessageSquare,
  DollarSign,
  Target,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TypewriterComponent from 'typewriter-effect'

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface BusinessMetrics {
  estimatedRoi?: string;
  implementationTime?: string;
  difficulty?: 'Low' | 'Medium' | 'High';
  priority?: 'Low' | 'Medium' | 'High';
}

interface BusinessPrompt {
  id: string
  text: string
  sentiment: string
  response: string
  category: string
  createdAt: Date
  isQuestion: boolean
  messages: Message[]
  metrics?: BusinessMetrics
}

// Constants for storage
const STORAGE_KEY = 'businessConversations'
const BACKUP_KEY = 'businessConversationsBackup'
const ACTIVE_CONVERSATION_KEY = 'activeConversation'
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

// Add new component for animated message
const AnimatedMessage = ({ message, role }: { message: Message; role: string }) => {
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
                delay: 30,
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
};

export default function BusinessAdvisor() {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<BusinessPrompt[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Add ref for scroll area
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Add scroll to bottom effect
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, []);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [conversations, scrollToBottom]);

  // Persist active conversation
  useEffect(() => {
    if (activeConversation) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversation)
    } else {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY)
    }
  }, [activeConversation])

  // Save handler with error handling and backup
  const saveConversations = useCallback((convs: BusinessPrompt[]) => {
    try {
      // Create backup of previous state
      const currentData = localStorage.getItem(STORAGE_KEY)
      if (currentData) {
        localStorage.setItem(BACKUP_KEY, currentData)
      }

      // Save new state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
      setLastSaved(new Date())
      console.log('Conversations saved successfully')
    } catch (error) {
      console.error('Error saving conversations:', error)
      setError('Failed to save your conversation. Please copy any important information.')
    }
  }, [])

  // Auto-save effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (conversations.length > 0) {
        saveConversations(conversations)
      }
    }, AUTO_SAVE_INTERVAL)

    return () => clearInterval(intervalId)
  }, [conversations, saveConversations])

  // Load conversations with error recovery
  useEffect(() => {
    try {
      // Try to load main storage
      const savedConversations = localStorage.getItem(STORAGE_KEY)
      const savedActive = localStorage.getItem(ACTIVE_CONVERSATION_KEY)
      
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt)
        }))
        setConversations(parsed)
        
        // Restore active conversation if it exists
        if (savedActive && parsed.some((conv: BusinessPrompt) => conv.id === savedActive)) {
          setActiveConversation(savedActive)
        }
      }
    } catch (error) {
      console.error('Error loading main storage:', error)
      try {
        // Try to recover from backup
        const backup = localStorage.getItem(BACKUP_KEY)
        if (backup) {
          const parsed = JSON.parse(backup).map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt)
          }))
          setConversations(parsed)
          setError('Recovered from backup. Some recent changes might be missing.')
        }
      } catch (backupError) {
        console.error('Error loading backup:', backupError)
        setError('Could not load your conversation history. Starting fresh.')
      }
    }
  }, [])

  // Save conversations whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations)
    }
  }, [conversations, saveConversations])

  // Export conversations to file
  const exportConversations = () => {
    try {
      const dataStr = JSON.stringify(conversations, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `business-advisor-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting conversations:', error)
      setError('Failed to export conversations. Please try again.')
    }
  }

  // Import conversations from file
  const importConversations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt)
        }))
        setConversations(prev => [...parsed, ...prev])
        setError(null)
      } catch (error) {
        console.error('Error importing conversations:', error)
        setError('Failed to import conversations. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    setError(null)

    try {
      const currentConversation = activeConversation 
        ? conversations.find(c => c.id === activeConversation)
        : null

      const conversationHistory = currentConversation?.messages || []
      const newUserMessage: Message = { role: 'user', content: input }
      
      const { sentiment, response, category, isQuestion } = await analyzeSentimentAndRespond(
        input,
        [...conversationHistory, newUserMessage]
      )
      
      const newAssistantMessage: Message = { role: 'assistant', content: response }
      const newMessages = [...conversationHistory, newUserMessage, newAssistantMessage]

      if (currentConversation) {
        // Update existing conversation
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation
            ? {
                ...conv,
                text: input,
                sentiment,
                response,
                category,
                isQuestion,
                messages: newMessages
              }
            : conv
        ))
      } else {
        // Create new conversation
        const newPrompt: BusinessPrompt = {
          id: Date.now().toString(),
          text: input,
          sentiment,
          response,
          category,
          isQuestion,
          messages: newMessages,
          createdAt: new Date()
        }
        setConversations(prev => [newPrompt, ...prev])
        setActiveConversation(newPrompt.id)
      }

      setInput('')
    } catch (error: any) {
      console.error('Error processing request:', error)
      setError(error.message || 'Failed to process your request. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const startNewConversation = () => {
    setActiveConversation(null)
    setInput('')
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'purpose': return <Heart className="h-4 w-4 text-purple-500" />
      case 'alignment': return <Target className="h-4 w-4 text-indigo-500" />
      case 'service': return <Users className="h-4 w-4 text-blue-500" />
      case 'abundance': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'wisdom': return <Lightbulb className="h-4 w-4 text-amber-500" />
      case 'community': return <Users className="h-4 w-4 text-pink-500" />
      case 'innovation': return <Laptop className="h-4 w-4 text-cyan-500" />
      case 'mastery': return <CheckCircle2 className="h-4 w-4 text-violet-500" />
      default: return <MessageSquare className="h-4 w-4 text-purple-500" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case 'purpose': return 'Soul Purpose'
      case 'alignment': return 'Energy Alignment'
      case 'service': return 'Divine Service'
      case 'abundance': return 'Sacred Abundance'
      case 'wisdom': return 'Inner Wisdom'
      case 'community': return 'Soul Tribe'
      case 'innovation': return 'Creative Flow'
      case 'mastery': return 'Spiritual Mastery'
      default: return 'Sacred Journey'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'ALIGNED': return <Heart className="h-4 w-4 text-purple-500" />
      case 'ALIGNED_TRANSFORMING': return <Target className="h-4 w-4 text-indigo-500" />
      case 'SEEKING': return <Lightbulb className="h-4 w-4 text-amber-500" />
      case 'SEEKING_TRANSFORMING': return <ArrowUpRight className="h-4 w-4 text-blue-500" />
      case 'TRANSFORMING': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default: return <MessageSquare className="h-4 w-4 text-purple-500" />
    }
  }

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'ALIGNED': return 'Soul Aligned'
      case 'ALIGNED_TRANSFORMING': return 'Divine Flow'
      case 'SEEKING': return 'Seeking Clarity'
      case 'SEEKING_TRANSFORMING': return 'Sacred Shift'
      case 'TRANSFORMING': return 'Transforming'
      default: return 'Journey Begins'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'ALIGNED': return 'bg-purple-50 text-purple-700'
      case 'ALIGNED_TRANSFORMING': return 'bg-indigo-50 text-indigo-700'
      case 'SEEKING': return 'bg-amber-50 text-amber-700'
      case 'SEEKING_TRANSFORMING': return 'bg-blue-50 text-blue-700'
      case 'TRANSFORMING': return 'bg-green-50 text-green-700'
      default: return 'bg-purple-50 text-purple-700'
    }
  }

  // Clear all stored data
  const clearStoredData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(BACKUP_KEY)
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY)
      setConversations([])
      setActiveConversation(null)
      setLastSaved(null)
      setError(null)
      console.log('All stored data cleared successfully')
    } catch (error) {
      console.error('Error clearing stored data:', error)
    }
  }, [])

  // Clear data on initial mount
  useEffect(() => {
    clearStoredData()
  }, [clearStoredData])

  const resetAll = () => {
    clearStoredData()
    setInput('')
    setIsProcessing(false)
    setError(null)
    window.location.reload() // Force a complete refresh
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 bg-gradient-to-b from-white to-purple-50">
      <div className="mb-8 relative">
        {/* Main Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-light text-foreground bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Soul-Guided Business Journey
            </h1>
            <p className="text-sm text-muted-foreground mt-2 italic">
              Aligning your business with universal wisdom
            </p>
          </div>
          <Button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            variant="ghost"
            className="fixed right-4 top-4 z-50 rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-purple-100 border border-purple-100 shadow-sm transition-all duration-300"
          >
            {isPanelOpen ? 
              <ChevronRight className="h-4 w-4 text-purple-600" /> : 
              <ChevronLeft className="h-4 w-4 text-purple-600" />
            }
          </Button>
        </div>

        {/* Slide-away Action Panel */}
        <div 
          className={`fixed right-0 top-0 h-full w-64 transition-transform duration-500 ease-in-out transform 
            ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} 
            bg-white/95 backdrop-blur-md border-l border-purple-100 shadow-lg z-40 p-6`}
        >
          <div className="flex flex-col gap-4 mt-16">
            <Button 
              onClick={resetAll}
              variant="soft"
              className="w-full justify-start bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors duration-300"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Begin Anew
            </Button>
            <Button 
              onClick={startNewConversation}
              variant="soft"
              className="w-full justify-start bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors duration-300"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              New Journey
            </Button>
            <Button
              onClick={exportConversations}
              variant="outline"
              className="w-full justify-start hover:bg-blue-50 transition-colors duration-300"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Share Wisdom
            </Button>
            <label className="cursor-pointer">
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-green-50 transition-colors duration-300"
                asChild
              >
                <span>
                  <Target className="mr-2 h-4 w-4" />
                  Import Journey
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importConversations}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Add overlay when panel is open */}
        {isPanelOpen && (
          <div 
            className="fixed inset-0 bg-black/5 backdrop-blur-sm z-30"
            onClick={() => setIsPanelOpen(false)}
          />
        )}

        {/* Journey Indicators */}
        <div className="flex justify-between items-center mt-6 bg-white/60 p-3 rounded-lg backdrop-blur-sm">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-700">Soul Alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-500" />
              <span className="text-sm text-indigo-700">Divine Purpose</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700">Sacred Path</span>
            </div>
          </div>
          {lastSaved && (
            <p className="text-xs text-muted-foreground">
              Journey saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <ScrollArea 
        className="h-[calc(100vh-400px)] rounded-lg border border-purple-100 bg-white/80 backdrop-blur-sm p-4 mb-6"
        ref={scrollAreaRef}
      >
        <AnimatePresence>
          <div className="space-y-6">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border border-purple-100 bg-white/90 p-6 shadow-sm transition-all hover:shadow-md ${
                  activeConversation === conv.id ? 'ring-2 ring-purple-400' : ''
                }`}
                onClick={() => setActiveConversation(conv.id)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(conv.category)}
                    <span className="text-sm font-light text-purple-800">{getCategoryLabel(conv.category)}</span>
                    {conv.metrics?.estimatedRoi && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Divine Abundance: {conv.metrics.estimatedRoi}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getSentimentColor(conv.sentiment)}`}>
                      {getSentimentIcon(conv.sentiment)}
                      <span>{getSentimentLabel(conv.sentiment)}</span>
                    </span>
                    {conv.messages.length > 2 && (
                      <div className="flex items-center text-xs text-indigo-600">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {Math.floor(conv.messages.length / 2)} revelations
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {conv.messages.map((msg, idx) => (
                    <AnimatedMessage key={idx} message={msg} role={msg.role} />
                  ))}
                </div>

                {conv.metrics?.implementationTime && (
                  <div className="mt-4 flex items-center gap-4 text-xs text-indigo-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Sacred Timeline: {conv.metrics.implementationTime}
                    </span>
                    {conv.metrics.difficulty && (
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Energy Required: {conv.metrics.difficulty}
                      </span>
                    )}
                    {conv.metrics.priority && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Divine Timing: {conv.metrics.priority}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 text-xs text-purple-600 italic">
                  Journey began: {new Date(conv.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
            {conversations.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-lg text-purple-800 font-light">
                  Welcome to your sacred business journey
                </p>
                <p className="text-sm text-indigo-600 mt-2 italic">
                  Let's explore your vision and align your business with your soul's purpose
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-0 bg-white/80 backdrop-blur-md pt-4 border-t border-purple-100"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField.Root>
            <TextField.Input
              placeholder={activeConversation 
                ? "Continue sharing your journey..." 
                : "Share what's in your heart about your business..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              className="min-h-[100px] resize-none p-4 rounded-lg border-purple-100 focus:border-purple-300 focus:ring-purple-200"
            />
          </TextField.Root>
          <div className="flex items-center justify-between">
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
              size="3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Receiving Wisdom...
                </>
              ) : (
                <>
                  {activeConversation ? 'Continue Journey' : 'Begin Journey'}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Soul Aligned
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Seeking Alignment
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                In Flow
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}