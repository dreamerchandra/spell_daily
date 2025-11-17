import { Select, MenuItem, FormControl } from '@mui/material';
import type { LeadStatus } from '../../type/all-users';

export const LeadStatusEditor = ({
  row,
  leadStatuses,
  handleLeadStatusUpdate,
  darkTheme,
}: {
  row: { testCode: string; leadStatus: string };
  leadStatuses: LeadStatus[] | undefined;
  handleLeadStatusUpdate: (testCode: string, leadStatus: string) => void;
  darkTheme: any;
}) => {
  return (
    <FormControl size="small" fullWidth>
      <Select
        value={row.leadStatus}
        onChange={e => handleLeadStatusUpdate(row.testCode, e.target.value)}
        variant="outlined"
        sx={{
          fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkTheme.background.hover,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkTheme.colors.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: darkTheme.colors.accent.blue,
          },
          '& .MuiSelect-select': {
            color: darkTheme.text.primary,
            backgroundColor: darkTheme.background.app,
            padding: '8px 12px',
          },
          '& .MuiSelect-icon': {
            color: darkTheme.text.secondary,
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: darkTheme.background.secondary,
              border: `1px solid ${darkTheme.background.hover}`,
              '& .MuiMenuItem-root': {
                color: darkTheme.text.primary,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: darkTheme.background.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: darkTheme.colors.primary + '20',
                  '&:hover': {
                    backgroundColor: darkTheme.colors.primary + '30',
                  },
                },
              },
            },
          },
        }}
      >
        {leadStatuses?.map(status => (
          <MenuItem key={status.id} value={status.value}>
            {status.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
