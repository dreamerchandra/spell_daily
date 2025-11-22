import type { LeadStatus } from '../../type/all-users';
import { PopoverSelect } from '../PopoverSelect';

export const LeadStatusEditor = ({
  row,
  leadStatuses,
  handleLeadStatusUpdate,
}: {
  row: { testCode: string; leadStatus: string };
  leadStatuses: LeadStatus[] | undefined;
  handleLeadStatusUpdate: (testCode: string, leadStatus: string) => void;
}) => {
  // Convert LeadStatus[] to the format expected by PopoverSelect
  const options =
    leadStatuses?.map(status => ({
      id: status.id,
      value: status.value,
      label: status.label,
    })) || [];

  const handleChange = (value: string) => {
    handleLeadStatusUpdate(row.testCode, value);
  };

  return (
    <PopoverSelect
      value={row.leadStatus}
      options={options}
      onChange={handleChange}
      placeholder="Select status"
    />
  );
};
