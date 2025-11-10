import type { ReactNode, MouseEvent } from 'react';

type ButtonVariant = 'text' | 'outline' | 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonClickEvent = MouseEvent<HTMLButtonElement>;

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  href: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Href({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  fullWidth = false,
  className = '',
  href,
  ...props
}: ButtonProps) {
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
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={() => {
        window.Telegram?.WebApp?.openLink?.(href);
      }}
      {...props}
    >
      {icon && <span className={children ? 'mr-2' : ''}>{icon}</span>}

      {children}
    </button>
  );
}
