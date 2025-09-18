import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse, ApiError } from '../../types';
import { chatApi } from '../../services/api';
import { getSessionId, clearSession } from '../../services/session';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatInterface.scss';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [conversationContext, setConversationContext] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const id = getSessionId();
        setSessionId(id);
        
        // Verify session with backend
        await chatApi.createSession(id);
        await loadChatHistory(id);
      } catch (err) {
        console.error('Failed to initialize session:', err);
        setError('Failed to initialize chat session. Please refresh the page.');
      }
    };

    initializeSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
  console.log('🧠 Updated conversation context:', conversationContext);
}, [conversationContext]);


  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await chatApi.getChatHistory(sessionId);
      if (response.messages) {
        const formattedMessages: Message[] = response.messages.map((msg: any) => ({
          id: `${msg.timestamp}-${msg.role}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
        
        // Build conversation context from previous assistant messages
        const context = formattedMessages
          .filter(msg => msg.role === 'assistant')
          .map(msg => msg.content)
          .join(' ');
        setConversationContext(context);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      const response: ChatResponse = await chatApi.sendMessage(sessionId, content.trim());
      
      const botMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update conversation context with the new response
      setConversationContext(prev => prev + ' ' + response.response);

    } catch (err) {
      const error = err as ApiError;
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = async () => {
    try {
      await chatApi.clearChatHistory(sessionId);
      const newSessionId = clearSession();
      setSessionId(newSessionId);
      setMessages([]);
      setError('');
      setConversationContext('');
      
      // Create new session in backend
      await chatApi.createSession(newSessionId);
    } catch (error) {
      console.error('Error resetting session:', error);
      setError('Failed to reset chat session. Please try again.');
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="header-left">
          <h2>📰 News Chatbot</h2>
          <span className="session-id">Session: {sessionId.substring(0, 8)}...</span>
          <span className="message-count">Messages: {messages.length}</span>
        </div>
        <button 
          className="reset-button"
          onClick={handleResetSession}
          title="Reset Conversation"
          disabled={isLoading}
        >
          ↻ Reset Chat
        </button>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError('')} className="dismiss-error">×</button>
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!!error}
      />
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;