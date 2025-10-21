import { useState, type ReactNode } from 'react';
import { randomImageByPath } from '../../config/emoji-manager';
import { SpeechBubble } from './speech-bubble/speech-bubble';

interface HeaderProps {
  ProgressComponent: ReactNode;
}

export const Header = ({ ProgressComponent }: HeaderProps) => {
  const img = randomImageByPath('by_rating/2');
  const [show, setShow] = useState(true);

  return (
    <header className={`m-auto flex max-w-md items-center justify-between p-4`}>
      <div />
      {ProgressComponent}
      <div
        tabIndex={0}
        onClick={() => {
          setShow(!show);
        }}
        className="relative z-[1000] h-16 w-16"
        aria-label="Profile"
      >
        <div className="right-0 top-0 h-14 w-14 text-2xl">
          <img src={`public/emoji/${img}`} alt="reaction" />
        </div>
        <SpeechBubble setShow={setShow} show={show} />
      </div>
    </header>
  );
};
