import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseClasses =
    'transform rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105 border';

  const getVariantStyle = (variant: string) => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--bg-gradient)',
          borderColor: 'var(--ui-border)',
          color: 'var(--text-inverse)',
        };
      case 'secondary':
        return {
          background: `linear-gradient(to right, var(--color-secondary), var(--color-secondary-dark))`,
          borderColor: 'var(--ui-border)',
          color: 'var(--text-inverse)',
        };
      case 'success':
        return {
          background: `linear-gradient(to right, var(--ui-success), var(--color-accent-dark))`,
          borderColor: 'var(--ui-border)',
          color: 'var(--text-inverse)',
        };
      case 'error':
        return {
          background: `linear-gradient(to right, var(--ui-error), #dc2626)`,
          borderColor: 'var(--ui-border)',
          color: 'var(--text-inverse)',
        };
      case 'ghost':
        return {
          background: 'var(--bg-surface)',
          borderColor: 'var(--ui-border)',
          color: 'var(--text-secondary)',
        };
      default:
        return {};
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const buttonStyle = disabled
    ? {
        cursor: 'not-allowed',
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--ui-border)',
        color: 'var(--interactive-disabled)',
        transform: 'none',
      }
    : getVariantStyle(variant);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};
