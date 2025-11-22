import Button from './Button';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface QuickDateFilterProps {
  onDateChange: (date: Date) => void;
  date: Date;
}

export const QuickDateFilter: React.FC<QuickDateFilterProps> = ({
  onDateChange,
  date,
}) => {
  const handleDateChange = (newDate: Date) => {
    onDateChange(newDate);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    handleDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    handleDateChange(newDate);
  };

  return (
    <div className="py-4 border-b border-gray-700">
      <div className="flex items-center justify-center gap-4 w-full">
        <Button
          variant="text"
          size="sm"
          onClick={handlePreviousDay}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <div className="text-center">
          <div className="text-lg font-semibold text-app-primary">
            {(() => {
              const today = new Date();
              const yesterday = new Date(Date.now() - 86400000);

              if (date.toDateString() === today.toDateString()) {
                return 'Today';
              } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Yesterday';
              } else {
                return date.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
              }
            })()}
          </div>
        </div>

        <Button
          variant="text"
          size="sm"
          onClick={handleNextDay}
          icon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
