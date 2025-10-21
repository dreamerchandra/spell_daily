import { useSyllabiSpeech } from '../../../hooks/useSpeech';

export const Syllable = ({
  wordDef,
}: {
  wordDef: { syllable: string[]; ipa: string[] };
}) => {
  const { speak } = useSyllabiSpeech();
  return (
    <div className="relative mb-4 text-center">
      <div className="gradient-border relative inline-block overflow-hidden rounded-2xl p-4">
        <div className="absolute inset-0 animate-pulse rounded-2xl border-2 border-blue-500 opacity-75"></div>
        <div className="relative z-10 flex gap-1 text-lg font-medium text-gray-200">
          {wordDef.ipa.map((part, index) => (
            <span className="relative" key={part}>
              <span
                className="mx-1 cursor-pointer underline"
                onClick={() => {
                  speak(wordDef.syllable[index]);
                }}
              >
                {part}
              </span>
              <span className="relative top-[-12px] text-[8px]">🔈</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
