import { useShortcut } from '../../hooks/use-shortcut';
import { Button } from './Button';

export const Speaker = ({
  onSpeak,
  isPlaying,
}: {
  onSpeak: () => void;
  isPlaying: boolean;
}) => {
  useShortcut('s', () => {
    if (!isPlaying) {
      onSpeak();
    }
  });
  return (
    <Button
      onClick={onSpeak}
      variant="secondary"
      disabled={isPlaying}
      className={`rounded-full p-3 ${isPlaying ? 'animate-bounce' : ''}`}
    >
      <span className="text-xl">{isPlaying ? '🎤' : '🔊'}</span>
    </Button>
  );
};
