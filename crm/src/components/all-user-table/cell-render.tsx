import { useNavigate } from 'react-router-dom';
import type { AllUsersData } from '../../type/all-users';
import Button from '../Button';
import { LeadStatusEditor } from './lead-status';
import { useCallback } from 'react';
import {
  updateLeadStatus,
  fetchLeadStatuses,
  updateStudentStatus,
} from '../../api/all-users';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useTelegram } from '../../hooks/useTelegram';
import { StudentStatusEditor } from './student-status';

export const darkTheme = {
  background: {
    app: '#111827',
    secondary: '#1f2937',
    hover: '#374151',
    paper: '#1f2937',
  },
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    accent: '#60a5fa',
  },
  colors: {
    primary: '#3b82f6',
    accent: {
      blue: '#60a5fa',
      orange: '#f97316',
      red: '#ef4444',
    },
  },
};

export const ParentUserRender = ({ row }: { row: AllUsersData }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/parent/${row.parentId}`)}
      className="cursor-pointer"
    >
      <div className="text-sm font-medium text-white-100">{row.parentName}</div>
      <div className="text-xs text-white-70">{row.details}</div>
    </div>
  );
};

export const PhoneNumberRender = ({ row }: { row: AllUsersData }) => {
  return (
    <Button
      variant="text"
      onClick={() => {
        window.open(`tel:${row.phoneNumber}`, '_blank');
      }}
    >
      {row.phoneNumber}
    </Button>
  );
};

export const TestCodeRender = ({ row }: { row: AllUsersData }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/analytics/${row.testCode}`)}
      className="cursor-pointer text-app-primary hover:underline"
    >
      {row.testCode}
    </div>
  );
};

export const LeadStatusRender = ({ row }: { row: AllUsersData }) => {
  const { initData } = useTelegram();
  const queryClient = useQueryClient();
  const { data: leadStatuses } = useQuery({
    queryKey: ['leadStatuses'],
    queryFn: () => fetchLeadStatuses(initData),
  });

  const handleLeadStatusUpdate = useCallback(
    async (testCode: string, newStatus: string) => {
      try {
        await updateLeadStatus(testCode, newStatus, initData);
        queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    },
    [initData, queryClient]
  );
  return (
    <LeadStatusEditor
      row={row}
      handleLeadStatusUpdate={handleLeadStatusUpdate}
      leadStatuses={leadStatuses}
    />
  );
};

export const StudentStatusRender = ({ row }: { row: AllUsersData }) => {
  const { initData } = useTelegram();
  const queryClient = useQueryClient();

  const onChange = useCallback(
    async (testCode: string, newStatus: string) => {
      try {
        await updateStudentStatus(testCode, newStatus, initData);
        queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    },
    [initData, queryClient]
  );
  return (
    <StudentStatusEditor
      row={row}
      onChange={onChange}
      status={['PAID', 'FREE_TRIAL', 'DICTATION']}
    />
  );
};
