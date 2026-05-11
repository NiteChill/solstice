import { Tabs } from '@heroui/react';
import { BottomBarButton } from './components/bottom-bar-button';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/use-auth';
import { getOptions, getSelectedKey } from '../../utils/navigation-utils';
import { useAuthNavigation } from '../../features/auth/hooks/use-auth-navigation';

export const BottomBar = () => {
  const { handleSelectionChange } = useAuthNavigation();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Tabs
      className="flex md:hidden pb-[env(safe-area-inset-bottom)]"
      selectedKey={getSelectedKey({ user, location })}
      onSelectionChange={handleSelectionChange}
    >
      <Tabs.List className="flex items-center justify-around bg-transparent p-4">
        {getOptions({ user }).map((opt) => (
          <BottomBarButton icon={opt.icon} id={opt.id} key={opt.id} />
        ))}
      </Tabs.List>
    </Tabs>
  );
};
