import { useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';

type ButtonVariant =
  | 'text'
  | 'outline'
  | 'primary'
  | 'secondary'
  | 'danger-text'
  | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonClickEvent = MouseEvent<HTMLButtonElement>;

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: ButtonClickEvent) => Promise<void> | void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const LoadingIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonClickEvent) => {
    if (!onClick || disabled || isLoading) return;

    try {
      setIsLoading(true);
      await onClick(e);
    } catch (error) {
      console.error('Button onClick error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || loading || isLoading;

  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-app',
    'disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const variantClasses = {
    primary: [
      'bg-primary-500 text-app-primary shadow-lg',
      'hover:bg-primary-600 active:bg-primary-700',
      'focus:ring-primary-500',
      'disabled:bg-primary-300 disabled:text-app-secondary',
    ].join(' '),

    secondary: [
      'bg-app-secondary text-app-primary border border-app-hover',
      'hover:bg-app-hover active:bg-dark-600',
      'focus:ring-app-secondary',
      'disabled:bg-dark-800 disabled:text-app-secondary disabled:border-dark-700',
    ].join(' '),

    outline: [
      'bg-transparent text-app-accent border-2 border-app-accent',
      'hover:bg-app-accent hover:text-app-primary active:bg-primary-600',
      'focus:ring-app-accent',
      'disabled:bg-transparent disabled:text-app-secondary disabled:border-app-secondary',
    ].join(' '),

    text: [
      'bg-transparent text-app-accent',
      'hover:bg-app-hover active:bg-app-secondary',
      'focus:ring-app-accent',
      'disabled:text-app-secondary',
    ].join(' '),

    danger: [
      'bg-red-500 text-white shadow-lg',
      'hover:bg-red-600 active:bg-red-700',
      'focus:ring-red-500',
      'disabled:bg-red-300 disabled:text-red-100',
    ].join(' '),
    'danger-text': [
      'bg-transparent text-red-500',
      'hover:bg-red-100 active:bg-red-200',
      'focus:ring-red-500',
      'disabled:text-red-300',
    ].join(' '),
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const showLoading = loading || isLoading;
  const leftIcon = showLoading ? (
    <LoadingIcon className={iconSize[size]} />
  ) : (
    icon
  );

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {leftIcon && <span className={children ? 'mr-2' : ''}>{leftIcon}</span>}

      {children}

      {rightIcon && !showLoading && (
        <span className={children ? 'ml-2' : ''}>{rightIcon}</span>
      )}
    </button>
  );
}
