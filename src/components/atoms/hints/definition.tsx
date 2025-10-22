export const Definition = ({ definition }: { definition: string }) => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-block rounded-2xl border border-dark-700/40 bg-gradient-to-r from-dark-800/60 to-dark-700/60 p-4 backdrop-blur-sm">
        <p className="text-lg font-medium text-gray-200">{definition}</p>
      </div>
    </div>
  );
};
