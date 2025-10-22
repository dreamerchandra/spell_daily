export const Progress = ({
  score,
  total,
}: {
  score: number;
  total: number;
}) => {
  return (
    <div className="w-[80vw] max-w-[200px] rounded-full border border-dark-700/30 bg-dark-800/40 p-1">
      <div
        className="h-1.5 rounded-full bg-gradient-to-r from-game-primary-300 to-game-primary-500 transition-all duration-500"
        style={{
          width: `${(score / total) * 100}%`,
        }}
      ></div>
    </div>
  );
};
