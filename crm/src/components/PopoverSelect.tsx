interface Option {
  id: string | number;
  value: string;
  label: string;
}

interface PopoverSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PopoverSelect: React.FC<PopoverSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm bg-app border border-gray-600 rounded-md focus:outline-none focus:ring-1 appearance-none ${
          disabled
            ? 'opacity-50 cursor-not-allowed text-gray-500'
            : 'text-app-primary hover:border-primary-500 focus:border-blue-500 focus:ring-blue-500'
        }`}
      >
        {placeholder && !value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className={`w-4 h-4 text-gray-400 ${disabled ? 'opacity-50' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
