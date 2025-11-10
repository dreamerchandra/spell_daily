import type { ReactNode } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { useNavigation } from '../hooks/useNavigation';

interface HeaderProps {
  children: ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const { canGoBack, goBack } = useNavigation();

  return (
    <div className="bg-app-secondary border-b border-gray-600">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={goBack}
              className="p-2 rounded-lg hover:bg-app transition-colors text-app-primary"
              aria-label="Go back"
            >
              <ArrowBack />
            </button>
          )}

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
