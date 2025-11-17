import React, { useEffect, useRef, useCallback } from 'react';
import { useFollowUps } from '../../../hooks/useFollowUps';
import { useTelegram } from '../../../hooks/useTelegram';
import { MessageInput } from '../../../components/MessageInput';
import { FollowUpMessage } from '../../../components/FollowUpMessage';
import { DateHeader } from '../../../components/DateHeader';

export const FollowUpTab: React.FC<{
  parentId: string;
}> = ({ parentId }) => {
  const { initData, user } = useTelegram();
  const adminName = user
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : 'You';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const { groupedFollowUps, loading, hasMore, error, loadMore, addFollowUp } =
    useFollowUps({
      parentId,
      apiKey: initData,
      adminName,
      limit: 20,
    });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
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
  }, [hasMore, loading, loadMore]);

  // Auto-scroll to bottom when new message is added
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Smooth scroll to bottom
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  // Initial scroll to bottom when messages first load
  useEffect(() => {
    if (groupedFollowUps.length > 0 && !loading) {
      // Small delay to ensure rendering is complete
      setTimeout(scrollToBottom, 100);
    }
  }, [groupedFollowUps.length, loading, scrollToBottom]);

  // Handle sending new follow-up
  const handleSendMessage = useCallback(
    async (text: string) => {
      await addFollowUp(text);
      // Small delay to ensure the message is rendered before scrolling
      setTimeout(scrollToBottom, 100);
    },
    [addFollowUp, scrollToBottom]
  );

  if (error && groupedFollowUps.length === 0) {
    return (
      <div className="flex flex-col h-full bg-app-secondary">
        <div className="p-4 border-b border-app-hover bg-app-primary">
          <h2 className="text-lg font-semibold text-app-primary">Follow-ups</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-red-500">
          <div className="text-center">
            <p className="text-lg font-medium">Error loading follow-ups</p>
            <p className="text-sm text-app-secondary mt-1">{error}</p>
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
        {hasMore && !loading && (
          <div ref={loadMoreTriggerRef} className="h-4" />
        )}

        {/* End of messages indicator */}
        {!hasMore && groupedFollowUps.length > 0 && (
          <div className="text-center py-4 text-app-secondary">
            <p className="text-sm">Beginning of conversation</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-app-secondary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              <span className="text-sm">Loading messages...</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4">
          {groupedFollowUps.length === 0 && !loading ? (
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
                <p className="text-lg">No follow-ups yet</p>
                <p className="text-sm mt-1">
                  Start the conversation by sending a message below.
                </p>
              </div>
            </div>
          ) : (
            // Render messages in chronological order (oldest first)
            [...groupedFollowUps].reverse().map((group, groupIndex) => (
              <div key={`${group.date}-${groupIndex}`} className="space-y-2">
                <DateHeader date={group.date} />
                <div className="space-y-2">
                  {[...group.items].reverse().map((followUp, index) => (
                    <FollowUpMessage
                      key={`${group.date}-${index}-${followUp.date.getTime()}`}
                      followUp={followUp}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MessageInput
        onSend={handleSendMessage}
        disabled={loading}
        placeholder="Type your follow-up message..."
      />
    </div>
  );
};
