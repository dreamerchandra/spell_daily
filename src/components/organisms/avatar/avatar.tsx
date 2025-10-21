import { useEffect, useRef, useState, type FC } from 'react';
import styles from './avatar.module.css';
import { pubSub } from '../../../util/pub-sub';
import type { AvatarData } from '../../common/avatar';
import { SpeechBubble } from './speech-bubble';
import { randomImageByPath } from '../../../config/emoji-manager';
import { useNextHint } from '../../../context/hint-context';
import { useShortcut } from '../../../hooks/use-shortcut';

const RandomHintMessages = [
  'Want some help?',
  'Felling stuck! Want some help?',
  'Too difficult! Maybe a hint?',
  'Stuck! I can get you some help?',
];

export const AvatarComponent: FC = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<AvatarData | null>(null);
  const body = useRef(document.body);
  const img = randomImageByPath('by_rating/2');
  const showNextHint = useNextHint();

  useEffect(() => {
    const showData = (data: AvatarData) => {
      setShow(true);
      setData(data);
    };
    pubSub.subscribe('Avatar', showData);
    return () => {
      pubSub.unsubscribe('Avatar', showData);
    };
  }, [setShow]);

  useEffect(() => {
    body.current.classList.toggle(styles.overdrop, show);
  }, [show]);

  const onYes = () => {
    const isHint = !data;
    if (isHint) {
      showNextHint();
    }
    data?.onYes?.();
    setShow(false);
  };

  const onNo = () => {
    data?.onNo?.();
    setShow(false);
  };

  useShortcut('h', showNextHint);
  const text =
    data?.text ??
    RandomHintMessages[Math.floor(Math.random() * RandomHintMessages.length)];

  return (
    <div
      className="relative"
      onClick={() => {
        setShow(!show);
      }}
    >
      <div className="right-0 top-0 h-14 w-14 text-2xl">
        <img src={`public/emoji/${img}`} alt="reaction" />
      </div>
      <SpeechBubble
        show={show}
        text={text}
        onNo={onNo}
        onYes={onYes}
        yesText={data?.yesText}
        noText={data?.noText}
      />
    </div>
  );
};

export const Avatar = {
  show: (data: AvatarData) => {
    pubSub.publish('Avatar', data);
  },
};
