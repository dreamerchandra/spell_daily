import React, { useEffect, useRef, useCallback, useState } from 'react';
import { MessageInput } from './MessageInput';
import { FollowUpMessage } from './FollowUpMessage';
import { DateHeader } from './DateHeader';
import { useDebounce } from './all-user-table/useDebounce';

export interface Message {
  id: string;
  text: string;
  date: Date;
  adminName: string;
}

export interface GroupedMessages {
  date: string;
  items: Message[];
}

export interface MessagingResponse {
  page: {
    total: number;
    currentPage: number;
    limit: number;
  };
  data: Message[];
}

export interface MessagingProps {
  // API functions
  fetchMessages: (page: number, limit: number) => Promise<MessagingResponse>;
  sendMessage: (text: string) => Promise<Message>;

  // Configuration
  limit?: number;
  placeholder?: string;
  title?: string;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;

  // Loading states
  initialLoading?: boolean;
  error?: string | null;
}

export const Messaging: React.FC<MessagingProps> = ({
  fetchMessages,
  sendMessage,
  limit = 20,
  placeholder = 'Type your message...',
  title = 'Messages',
  emptyStateMessage = 'No messages yet',
  emptyStateSubMessage = 'Start the conversation by sending a message below.',
  initialLoading = false,
  error = null,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages[]>([]);
  const loading = useRef(initialLoading);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sendError, setSendError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Group messages by date
  const groupByDate = useCallback((items: Message[]): GroupedMessages[] => {
    const groups: { [key: string]: Message[] } = {};

    items.forEach(item => {
      const dateKey = item.date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    // Sort groups by date (most recent first) and sort items within each group (most recent first)
    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => b.date.getTime() - a.date.getTime()),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Load messages for a specific page
  const loadMessages = useCallback(
    async (page: number, append = false) => {
      try {
        loading.current = true;
        setSendError(null);

        const response = await fetchMessages(page, limit);

        setCurrentPage(response.page.currentPage);
        setHasMore(
          response.page.currentPage <
            Math.ceil(response.page.total / response.page.limit)
        );

        if (append) {
          setMessages(prev => [...prev, ...response.data]);
        } else {
          setMessages(response.data);
        }
      } catch (err) {
        setSendError(
          err instanceof Error ? err.message : 'Failed to load messages'
        );
      } finally {
        loading.current = false;
      }
    },
    [fetchMessages, limit]
  );

  // Load more messages (for infinite scroll)
  const loadMore = useCallback(() => {
    if (hasMore && !loading.current) {
      loadMessages(currentPage + 1, true);
    }
  }, [hasMore, currentPage, loadMessages]);
  const debouncedLoadMore = useDebounce(loadMore, 100);

  // Handle sending new message
  const handleSendMessage = useCallback(
    async (text: string) => {
      try {
        setSendError(null);
        const newMessage = await sendMessage(text);

        // Add to the beginning of the list (most recent)
        setMessages(prev => [newMessage, ...prev]);

        // Scroll to bottom after a short delay
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth',
            });
          }
        }, 100);
      } catch (err) {
        setSendError(
          err instanceof Error ? err.message : 'Failed to send message'
        );
        throw err; // Re-throw so MessageInput can handle it
      }
    },
    [sendMessage]
  );

  // Refresh messages
  const refresh = useCallback(() => {
    setCurrentPage(1);
    setMessages([]);
    loadMessages(1);
  }, [loadMessages]);

  // Update grouped messages whenever messages changes
  useEffect(() => {
    setGroupedMessages(groupByDate(messages));
  }, [messages, groupByDate]);

  // Initial load
  useEffect(() => {
    const timerId = setTimeout(() => {
      loadMessages(1);
    }, 10);
    return () => clearTimeout(timerId);
  }, [loadMessages]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading.current) {
          debouncedLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(trigger);

    return () => {
      observer.unobserve(trigger);
    };
  }, [hasMore, debouncedLoadMore]);

  // Auto-scroll to bottom when messages first load
  useEffect(() => {
    if (groupedMessages.length > 0 && !loading.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [groupedMessages.length > 0 && !loading.current]);

  // Error state
  if (error && groupedMessages.length === 0) {
    return (
      <div className="flex flex-col h-full bg-app-secondary">
        <div className="p-4 border-b border-app-hover bg-app-primary">
          <h2 className="text-lg font-semibold text-app-primary">{title}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-red-500">
          <div className="text-center">
            <p className="text-lg font-medium">Error loading messages</p>
            <p className="text-sm text-app-secondary mt-1">{error}</p>
            <button
              onClick={refresh}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-app-secondary">
      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          minHeight: 0, // Important for flex child to be scrollable
        }}
      >
        {/* Load more trigger (at the top for older messages) */}
        {hasMore && !loading.current && (
          <div ref={loadMoreTriggerRef} className="h-4" />
        )}

        {/* End of messages indicator */}
        {!hasMore && groupedMessages.length > 0 && (
          <div className="text-center py-4 text-app-secondary">
            <p className="text-sm">Beginning of conversation</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading.current && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-app-secondary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              <span className="text-sm">Loading messages...</span>
            </div>
          </div>
        )}

        {/* Error indicator */}
        {sendError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{sendError}</p>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {groupedMessages.length === 0 && !loading.current ? (
            <div className="text-center py-12 text-app-secondary">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </div>
                <p className="text-lg">{emptyStateMessage}</p>
                <p className="text-sm mt-1">{emptyStateSubMessage}</p>
              </div>
            </div>
          ) : (
            // Render messages in chronological order (oldest first)
            [...groupedMessages].reverse().map((group, groupIndex) => (
              <div key={`${group.date}-${groupIndex}`} className="space-y-2">
                <DateHeader date={group.date} />
                <div className="space-y-2">
                  {[...group.items].reverse().map((message, index) => (
                    <FollowUpMessage
                      key={`${group.date}-${index}-${message.date.getTime()}`}
                      followUp={message}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={loading.current}
        placeholder={placeholder}
      />
    </div>
  );
};
