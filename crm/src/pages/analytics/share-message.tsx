import { WhatsApp } from '@mui/icons-material';
import type { DailyUsage } from './useAnalytics.ts';
import Button from '../../components/Button.tsx';
import { useEffect, useState } from 'react';
import {
  newMessageTemplate,
  appreciationMessageTemplate,
} from './message-templates.tsx';
import { followUpMessageTemplate } from './message-templates';
import { markFollowUpApi } from '../../api/followup-analytics';
import { useTelegram } from '../../hooks/useTelegram.ts';

const generateWhatsAppLink = (phoneNumber: string, message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/+91${phoneNumber}?text=${encodedMessage}`;
};

const getLink = (testCode: string) =>
  `https://app.spelldaily.com/?code=${testCode}`;

const ShareMessage = ({
  text,
  onChange,
  href,
  onClick,
}: {
  text: string;
  onChange: (value: string) => void;
  href: string;
  onClick?: () => Promise<void>;
}) => {
  return (
    <div className="flex gap-1 flex-col">
      <div className="bg-green-100 border border-green-200 text-green-800 rounded">
        🎉 New test code created successfully!
      </div>
      <textarea
        className="mt-2 w-full p-2 border border-gray-300 rounded bg-gray-50 text-black h-auto field-sizing-content"
        value={text}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
      <Button
        variant="secondary"
        onClick={async () => {
          if (onClick) {
            await onClick();
          }
          window.Telegram?.WebApp?.openLink?.(href);
        }}
        icon={<WhatsApp />}
      >
        Send WhatsApp Message
      </Button>
    </div>
  );
};

const WelcomeMessage = ({
  dailyUsage,
  testCode,
}: {
  dailyUsage: DailyUsage;
  testCode: string;
}) => {
  const [newMessage, setNewMessage] = useState('');
  useEffect(() => {
    setNewMessage(
      newMessageTemplate({
        studentName: dailyUsage?.student?.name,
        link: getLink(testCode || ''),
      })
    );
  }, [dailyUsage, testCode]);

  return (
    <ShareMessage
      text={newMessage}
      onChange={setNewMessage}
      href={generateWhatsAppLink(
        dailyUsage?.parent?.phoneNumber || '',
        newMessage
      )}
    />
  );
};

const FollowupMessage = ({
  dailyUsage,
  testCode,
}: {
  dailyUsage: DailyUsage;
  testCode: string;
}) => {
  const [newMessage, setNewMessage] = useState('');
  const { initData } = useTelegram();
  useEffect(() => {
    setNewMessage(
      followUpMessageTemplate({
        studentName: dailyUsage?.student?.name,
        link: getLink(testCode || ''),
      })
    );
  }, [dailyUsage, testCode]);

  return (
    <ShareMessage
      text={newMessage}
      onChange={setNewMessage}
      href={generateWhatsAppLink(
        dailyUsage?.parent?.phoneNumber || '',
        newMessage
      )}
      onClick={async () => {
        markFollowUpApi({
          parentId: dailyUsage.parent?.id || '',
          testCode: testCode,
          notes: newMessage,
          apiKey: initData,
        });
      }}
    />
  );
};

const AchievementMessage = ({
  dailyUsage,
  testCode,
}: {
  dailyUsage: DailyUsage;
  testCode: string;
}) => {
  const [newMessage, setNewMessage] = useState('');
  useEffect(() => {
    const numberOfDaysCompleted = dailyUsage.startedAt
      ? Math.floor(
          (new Date().getTime() - new Date(dailyUsage.startedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;
    setNewMessage(
      appreciationMessageTemplate({
        studentName: dailyUsage?.student?.name,
        numberOfDays: numberOfDaysCompleted,
      })
    );
  }, [dailyUsage, testCode]);

  return (
    <ShareMessage
      text={newMessage}
      onChange={setNewMessage}
      href={generateWhatsAppLink(
        dailyUsage?.parent?.phoneNumber || '',
        newMessage
      )}
    />
  );
};

export const ShareWelcomeMessage = ({
  dailyUsage,
  testCode,
  isNew,
  currentMonth,
}: {
  dailyUsage: DailyUsage;
  testCode: string;
  isNew: boolean;
  currentMonth: number;
}) => {
  const today = new Date();
  if (currentMonth !== today.getMonth()) {
    return null;
  }
  if (isNew) {
    return <WelcomeMessage dailyUsage={dailyUsage} testCode={testCode} />;
  }
  const isNotStartedToday = dailyUsage.notStarted.some(date => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  });
  if (isNotStartedToday) {
    return <FollowupMessage dailyUsage={dailyUsage} testCode={testCode} />;
  }
  return <AchievementMessage dailyUsage={dailyUsage} testCode={testCode} />;
};
