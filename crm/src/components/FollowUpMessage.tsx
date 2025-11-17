import React from 'react';
import type { FollowUp } from '../api/follow-ups';

interface FollowUpMessageProps {
  followUp: FollowUp;
}

export const FollowUpMessage: React.FC<FollowUpMessageProps> = ({
  followUp,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Process text to handle newlines and tabs
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.split('\t').map((segment, segIndex) => (
          <React.Fragment key={segIndex}>
            {segIndex > 0 && <span className="inline-block w-8" />}
            {segment}
          </React.Fragment>
        ))}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col gap-1 p-3 bg-app-primary rounded-lg border border-app-hover">
      <div className="flex justify-between items-start gap-2">
        <span className="font-medium text-app-accent text-sm">
          {followUp.adminName}
        </span>
        <span className="text-app-secondary text-xs whitespace-nowrap">
          {formatTime(followUp.date)}
        </span>
      </div>
      <div className="text-app-primary text-sm whitespace-pre-wrap break-words">
        {formatText(followUp.text)}
      </div>
    </div>
  );
};
