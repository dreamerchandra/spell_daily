import { Header } from '../../components/Header';
import { useTelegram } from '../../hooks/useTelegram';
import { getTimeOfDay } from '../../utils/get-time-of-day';
import { HomeTab } from './home-tabs';

export default function Home() {
  const { user } = useTelegram();

  return (
    <div className="min-h-screen bg-app text-app-primary">
      <Header>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">👋</div>
          <div>
            <div className="text-sm text-gray-400">{getTimeOfDay()}</div>
            <div className="text-lg font-semibold text-app-primary">
              Hi, {user?.first_name || 'User'}
            </div>
          </div>
        </div>
      </Header>
      <HomeTab />
    </div>
  );
}
