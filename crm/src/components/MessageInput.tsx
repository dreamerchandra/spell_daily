import React, { useState } from 'react';
import Button from './Button';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type your follow-up message...',
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || sending || disabled) return;

    const messageText = message.trim();

    try {
      setSending(true);
      await onSend(messageText);
      setMessage(''); // Only clear on success
    } catch (error) {
      console.error('Failed to send message:', error);
      // Keep the message in the input so user can retry
      // You might want to show an error toast here
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (but allow Shift+Enter for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-app-hover bg-app-secondary"
    >
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="
              w-full resize-none rounded-lg border border-app-hover 
              bg-app text-app-primary px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-app-secondary
              min-h-[44px] max-h-32
            "
            rows={1}
            style={{
              height: 'auto',
              minHeight: '44px',
              maxHeight: '128px',
              overflowY: message.split('\n').length > 3 ? 'auto' : 'hidden',
            }}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          loading={sending}
          size="md"
          className="px-6"
        >
          Send
        </Button>
      </div>
    </form>
  );
};
