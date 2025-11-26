export const Definition = ({ definition }: { definition: string }) => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-block rounded-2xl border border-gray-300 bg-gradient-to-r from-white to-gray-50 p-4 backdrop-blur-sm shadow-sm">
        <p className="text-lg font-medium text-ui-text">{definition}</p>
      </div>
    </div>
  );
};
