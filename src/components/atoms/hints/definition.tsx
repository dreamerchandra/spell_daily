export const Definition = ({ definition }: { definition: string }) => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-block rounded-2xl border border-slate-600/40 bg-gradient-to-r from-slate-700/60 to-slate-600/60 p-4 backdrop-blur-sm">
        <p className="text-lg font-medium text-gray-200">{definition}</p>
      </div>
    </div>
  );
};
