import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, type FC } from 'react';

export const Search: FC<{
  onChange: (value?: string | null) => void;
}> = ({ onChange }) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = ref.current;
    const onInputListener = (event: Event) => {
      onChange((event.currentTarget as HTMLInputElement)?.value || null);
    };
    input?.addEventListener('input', onInputListener);
    return () => {
      input?.removeEventListener('input', onInputListener);
    };
  }, [onChange, ref]);
  return (
    <div className="px-6 py-4">
      <div className="px-5 py-3 flex gap-2 bg-app-secondary rounded-lg border-none focus:ring-2 focus:ring-primary-500 focus:outline-none">
        <SearchIcon />
        <input
          ref={ref}
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-app-primary border-none focus:ring-0 focus:outline-none text-lg"
        />
      </div>
    </div>
  );
};
