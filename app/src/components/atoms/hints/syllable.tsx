import { useSyllabiSpeech } from '../../../hooks/useSpeech';

export const Syllable = ({
  wordDef,
}: {
  wordDef: { syllable: string[]; ipa: string[] };
}) => {
  const { speak } = useSyllabiSpeech();
  return (
    <div className="relative mb-4 flex items-center justify-center gap-2 text-center">
      <p className="text-3xl">👉 </p>
      <div className="gradient-border relative inline-block overflow-hidden rounded-2xl">
        <div className="relative z-10 flex gap-1 text-lg font-medium text-gray-200 bg-primary-gradient px-4 py-2 rounded-xl">
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
