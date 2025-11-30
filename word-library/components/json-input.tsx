import { useEffect, useRef } from "react";

export const JsonInput = ({
  value,
  onChange,
  isString = false,
}: {
  value: string;
  onChange: (val: string) => void;
  isString?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = '0px';
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <span className="inline-flex items-center">
      {isString && <span className="text-green-400">"</span>}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        className="min-w-[20px] max-w-full bg-transparent p-0 font-mono text-sm text-green-400 outline-none focus:ring-0 border-none h-auto"
        style={{ width: `${Math.max(20, value.length * 8)}px` }}
      />
      {isString && <span className="text-green-400">"</span>}
    </span>
  );
};
