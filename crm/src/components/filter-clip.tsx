export type Filter<T> = {
  value: T;
  label: string;
};

export const FilterClip = <T,>({
  selected,
  onChange,
  allFilters,
  defaultFilter,
}: {
  selected: Filter<T>;
  onChange: (filter: Filter<T>) => void;
  allFilters: Filter<T>[];
  defaultFilter: T;
}) => {
  return (
    <div className="flex gap-2 flex-nowrap">
      {allFilters.map(filter => {
        const isSelected = selected.value === filter.value;
        return (
          <button
            key={filter.value as string}
            className={`px-3 py-1 rounded-full border whitespace-nowrap ${
              isSelected
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-200 text-gray-700 border-gray-200'
            }`}
            onClick={() => {
              if (isSelected) {
                const fallBack = allFilters.find(
                  f => f.value === defaultFilter
                );
                if (fallBack) {
                  onChange(fallBack);
                  return;
                }
              } else {
                onChange(filter);
              }
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
