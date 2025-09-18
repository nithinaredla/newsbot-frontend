import React, { useState } from 'react';
import './MessageInput.scss';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Chat is disabled due to error" : "Ask about recent news..."}
          disabled={isLoading || disabled}
          className="message-field"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="send-button"
          title="Send message"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
      
      <div className="input-footer">
        <span className="char-count">
          {message.length}/1000
        </span>
        {disabled && (
          <span className="error-text">
            Please reset chat to continue
          </span>
        )}
      </div>
    </form>
  );
};
export default MessageInput;