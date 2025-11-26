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
      'bg-gradient-to-r from-ui-primary to-ui-accentBlue border-ui-primary/30 text-white hover:from-indigo-600 hover:to-blue-600',
    secondary:
      'bg-gradient-to-r from-ui-accentCoral to-red-400 border-ui-accentCoral/30 text-white hover:from-red-500 hover:to-red-500',
    success:
      'bg-gradient-to-r from-game-success-600 to-game-success-700 border-game-success-500/30 text-white hover:from-game-success-700 hover:to-game-success-800',
    error:
      'bg-gradient-to-r from-game-error-600 to-game-error-700 border-game-error-500/30 text-white hover:from-game-error-700 hover:to-game-error-800',
    ghost:
      'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-ui-text hover:from-gray-200 hover:to-gray-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses =
    'cursor-not-allowed bg-gray-200 border-gray-300 text-gray-400 hover:scale-100';

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
