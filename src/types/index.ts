export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  relevantArticles?: RelevantArticle[];
  sessionId: string;
  timestamp: string;
}

export interface RelevantArticle {
  title: string;
  url: string;
  text: string;
  authors: string;
  date_publish: string;
  score: number;
  distance: number;
  chunk_id?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface SystemStatus {
  status: string;
  services: {
    redis: string;
    chroma: string;
    gemini: string;
    jina: string;
  };
  database: {
    collection: string;
    documentCount: number;
    status: string;
    message: string;
  };
  timestamp: string;
}

export interface SessionInfo {
  sessionId: string;
  createdAt: string;
  messageCount: number;
  ttlSeconds: number;
  expiresAt: string;
  status: string;
}