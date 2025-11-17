import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { getTimeOfDay } from '../../utils/get-time-of-day';
import { ParentTab } from './tab/index';
import { useParentUsers } from './useParentUsers';

export default function CodeGenerator() {
  const { parentId } = useParams<{ parentId: string }>();

  const { data: usersResponse } = useParentUsers({
    parentId: parentId || '',
  });
  const [_selectedIds, _setSelectedIds] = useState<string[]>([]);

  return (
    <div className="h-screen flex flex-col bg-app text-app-primary">
      <Header>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📝</div>
          <div>
            <div className="text-sm text-gray-400">{getTimeOfDay()}</div>
            <div className="text-lg font-semibold text-app-primary">
              {usersResponse?.users[0]
                ? `${usersResponse.users[0].parentName}'s Kids`
                : 'Parent Name'}
            </div>
          </div>
        </div>
      </Header>
      <div className="flex-1 overflow-hidden">
        <ParentTab />
      </div>
    </div>
  );
}
