import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExpandMore } from '@mui/icons-material';

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
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const currentOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const dropdownContent = isOpen && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999]"
        onClick={() => setIsOpen(false)}
      />

      {/* Options */}
      <div
        className="fixed z-[10000] bg-app-secondary border border-gray-600 rounded-md shadow-xl max-h-60 overflow-auto"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          minWidth: dropdownPosition.width,
        }}
      >
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={`w-full px-3 py-2 text-sm text-left text-app-primary hover:bg-gray-700 focus:bg-gray-700 focus:outline-none whitespace-nowrap ${
              option.value === value
                ? 'bg-primary-500 bg-opacity-20 text-primary-300'
                : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm text-left bg-app border border-gray-600 rounded-md focus:outline-none focus:ring-1 flex items-center justify-between ${
          disabled
            ? 'opacity-50 cursor-not-allowed text-gray-500'
            : 'text-app-primary hover:border-primary-500 focus:border-blue-500 focus:ring-blue-500'
        }`}
      >
        <span className="truncate">{currentOption?.label || placeholder}</span>
        <ExpandMore
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${disabled ? 'opacity-50' : ''}`}
        />
      </button>

      {createPortal(dropdownContent, document.body)}
    </div>
  );
};
