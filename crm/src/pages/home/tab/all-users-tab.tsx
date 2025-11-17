import React from 'react';
import { AllUsersTable } from '../../../components/all-user-table';

interface AllUsersTabProps {
  apiKey: string;
}

export const AllUsersTab: React.FC<AllUsersTabProps> = ({ apiKey }) => {
  return (
    <div className="p:0 lg:p-3">
      <AllUsersTable apiKey={apiKey} />
    </div>
  );
};

export default AllUsersTab;
