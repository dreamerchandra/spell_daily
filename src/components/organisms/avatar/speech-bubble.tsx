import type { FC } from 'react';
import styles from './avatar.module.css';

type SpeechBubbleProps = {
  show: boolean;
  yesText?: string;
  noText?: string;
  text: string;
  onYes: () => void;
  onNo: () => void;
};

export const SpeechBubble: FC<SpeechBubbleProps> = ({
  show,
  yesText = 'Yes, Please!',
  noText = 'No, Thanks!',
  text,
  onYes,
  onNo,
}) => {
  return (
    <dialog open={show} className={styles.hintBubble}>
      <p>{text}</p>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.yes}`} onClick={onYes}>
          {yesText}
        </button>
        <button className={`${styles.btn} ${styles.no}`} onClick={onNo}>
          {noText}
        </button>
      </div>
    </dialog>
  );
};
