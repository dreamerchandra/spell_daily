import { useTheme } from '../../context/theme-context';

export const ThemeButton = () => {
  const { themeName, nextTheme } = useTheme();

  return (
    <button
      onClick={nextTheme}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-200 hover:scale-[1.02]"
      style={{
        color: 'var(--text-primary)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'var(--interactive-hover)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div
        className="flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
        style={{
          background:
            'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
        }}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: 'var(--text-inverse)' }}
        />
      </div>
      <div className="flex flex-col">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {themeName}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Click to cycle themes
        </span>
      </div>
    </button>
  );
};
