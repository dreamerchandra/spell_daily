import React from 'react';
import { createFollowUp, getFollowUps } from '../../../api/follow-ups';
import { Messaging } from '../../../components/Messaging';
import { useTelegram } from '../../../hooks/useTelegram';

export const FollowUpTab: React.FC<{
  parentId: string;
  testCode?: string;
}> = ({ parentId, testCode }) => {
  const { initData } = useTelegram();
  if (!initData) {
    return null;
  }
  return (
    <Messaging
      fetchMessages={(page, limit) =>
        getFollowUps({ parentId, page, limit, testCode }, initData)
      }
      sendMessage={async text => {
        return await createFollowUp({ parentId, text, testCode }, initData);
      }}
    />
  );
};
