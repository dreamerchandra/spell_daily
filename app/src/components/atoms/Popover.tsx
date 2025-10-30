import { type ReactNode, useRef, useEffect } from 'react';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const Popover = ({
  trigger,
  children,
  isOpen,
  onToggle,
}: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={onToggle}>
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-dark-600/30 bg-gradient-to-b from-dark-700/95 to-dark-800/95 p-2 shadow-xl backdrop-blur-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
};
