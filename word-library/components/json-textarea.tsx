import { useEffect, useRef, useState } from "react";

export const JsonTextArea = ({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (val: unknown) => void;
}) => {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    try {
      const parsed = JSON.parse(newText);
      onChange(parsed);
    } catch {
      // Invalid JSON, just update local text
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={handleChange}
      className="w-full resize-none bg-transparent p-0 font-mono text-sm text-yellow-300 outline-none focus:ring-0 border-none block"
      spellCheck={false}
    />
  );
};
