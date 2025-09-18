import { v4 as uuidv4 } from 'uuid';
import { chatApi } from './api';

export const generateSessionId = (): string => {
  return `sess_${Date.now()}_${uuidv4().substr(0, 8)}`;
};

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('newsbot_session_id');
  
  if (!sessionId || !isValidSessionId(sessionId)) {
    sessionId = generateSessionId();
    localStorage.setItem('newsbot_session_id', sessionId);
  }
  
  return sessionId;
};

export const clearSession = (): string => {
  const newSessionId = generateSessionId();
  localStorage.setItem('newsbot_session_id', newSessionId);
  return newSessionId;
};

export const isValidSessionId = (sessionId: string): boolean => {
  const sessionIdRegex = /^sess_\d+_[a-zA-Z0-9]{8}$/;
  return sessionIdRegex.test(sessionId);
};

// New function to initialize session with backend
export const initializeSessionWithBackend = async (sessionId: string): Promise<boolean> => {
  try {
    await chatApi.createSession(sessionId);
    return true;
  } catch (error) {
    console.error('Failed to initialize session with backend:', error);
    return false;
  }
};