import { useEffect, useRef, type FC } from 'react';
import styles from './speech-bubble.module.css';

export const SpeechBubble: FC<{
  show: boolean;
  setShow: (show: boolean) => void;
}> = ({ show, setShow }) => {
  const body = useRef(document.body);

  useEffect(() => {
    body.current.classList.toggle(styles.overdrop, show);
  }, [show]);

  return (
    <dialog open={show} className={styles.hintBubble}>
      <p>Stuck? Tap me for a hint.</p>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.no}`}
          onClick={() => setShow(false)}
        >
          No, thanks
        </button>
        <button
          className={`${styles.btn} ${styles.yes}`}
          onClick={() => setShow(false)}
        >
          Try it now
        </button>
      </div>
    </dialog>
  );
};
