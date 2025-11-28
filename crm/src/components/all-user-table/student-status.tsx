import type { StudentStatus } from '../../type/all-users';
import { PopoverSelect } from '../PopoverSelect';

export const getStudentStatusLabel = (status: StudentStatus) => {
  switch (status) {
    case 'PAID':
      return 'Premium';
    case 'FREE_TRIAL':
      return 'Free Trial';
    case 'DICTATION':
      return 'Dictation';
    default:
      return status;
  }
};

export const StudentStatusEditor = ({
  row,
  status,
  onChange,
}: {
  row: { testCode: string; status: string };
  status: StudentStatus[];
  onChange: (testCode: string, status: string) => void;
}) => {
  // Convert LeadStatus[] to the format expected by PopoverSelect
  const options =
    status?.map(status => ({
      id: status,
      value: status,
      label: getStudentStatusLabel(status),
    })) || [];
  const handleChange = (value: string) => {
    onChange(row.testCode, value);
  };

  return (
    <PopoverSelect
      value={row.status}
      options={options}
      onChange={handleChange}
      placeholder="Select status"
    />
  );
};
