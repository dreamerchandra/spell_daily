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

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-game-primary-600 to-game-primary-700 border-game-primary-500/30 text-white hover:from-game-primary-700 hover:to-game-primary-800',
    secondary:
      'bg-gradient-to-r from-game-secondary-600 to-game-secondary-700 border-game-secondary-500/30 text-white hover:from-game-secondary-700 hover:to-game-secondary-800',
    success:
      'bg-gradient-to-r from-game-success-600 to-game-success-700 border-game-success-500/30 text-white hover:from-game-success-700 hover:to-game-success-800',
    error:
      'bg-gradient-to-r from-game-error-600 to-game-error-700 border-game-error-500/30 text-white hover:from-game-error-700 hover:to-game-error-800',
    ghost:
      'bg-gradient-to-r from-dark-700/70 to-dark-800/70 border-dark-600/30 text-gray-200 hover:from-dark-800 hover:to-dark-900',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses =
    'cursor-not-allowed bg-dark-800/50 border-dark-700/30 text-dark-500 hover:scale-100';

  const combinedClasses = `
    ${baseClasses}
    ${disabled ? disabledClasses : variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <button onClick={onClick} disabled={disabled} className={combinedClasses}>
      {children}
    </button>
  );
};
