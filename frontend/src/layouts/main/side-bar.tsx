import { buttonVariants, Card, Link, Tabs } from '@heroui/react';
import { getOptions, getSelectedKey } from '../../utils/navigation-utils';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/use-auth';
import { SideBarButton } from './components/side-bar-button';
import { useState } from 'react';
import { SideBarHeaderOpen } from './components/side-bar-header-open';
import { SideBarHeaderClose } from './components/side-bar-header-close';
import { useAuthNavigation } from '../../features/auth/hooks/use-auth-navigation';
import { useSaveShortcut } from '../../hooks/use-save-shortcut';
import { SideBarAccountCard } from './components/side-bar-account-card';
import { LogIn } from 'lucide-react';

export const SideBar = () => {
  const { handleSelectionChange } = useAuthNavigation();
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useSaveShortcut(() => setIsOpen((prev) => !prev));
  return (
    <div
      className={`hidden flex-col md:flex outline-1 outline-border transition-width ease-in duration-300 ${isOpen ? 'w-65' : 'w-16'}`}
    >
      {isOpen ? (
        <SideBarHeaderOpen setIsOpen={setIsOpen} />
      ) : (
        <SideBarHeaderClose setIsOpen={setIsOpen} />
      )}
      <Tabs
        orientation="vertical"
        className="flex-1 px-3"
        selectedKey={getSelectedKey({ user, location })}
        onSelectionChange={handleSelectionChange}
      >
        <Tabs.List className="bg-transparent w-full gap-0.5 p-0">
          {getOptions({ user, iconSize: 4 }).map((opt) => (
            <SideBarButton
              icon={opt.icon}
              label={opt.label}
              displayLabel={isOpen}
              id={opt.id}
              key={opt.id}
            />
          ))}
        </Tabs.List>
      </Tabs>
      <div
        className={`p-2.5 transition-colors border-t duration-300 ease-in ${!isOpen && 'border-transparent'}`}
      >
        {user ? (
          <SideBarAccountCard user={user} isOpen={isOpen} />
        ) : (
          <Card
            variant="transparent"
            className={`p-2.5 gap-5 rounded-none transition-height transition-padding duration-300 ease-in justify-end ${isOpen ? 'p-2.5 h-40' : 'p-1 h-11'}`}
          >
            <div
              className={`flex flex-col transition-opacity duration-300 ease-in gap-3 ${!isOpen && 'opacity-0'}`}
            >
              <h2 className="text-sm font-medium w-55">
                Get the full solstice experience
              </h2>
              <p className="text-xs text-muted w-55">
                Log in to get your own personal feed, interact with others and
                follow your favorite creators.
              </p>
            </div>
            <Link
              href="/auth/login"
              className={buttonVariants({
                fullWidth: true,
                variant: 'tertiary',
                isIconOnly: !isOpen,
                className: 'w-full shrink-0',
              })}
            >
              <p
                className={`transition-opacity ease-in ${isOpen ? 'duration-200' : 'opacity-0 duration-200 delay-100'}`}
              >
                Log in
              </p>
              <LogIn
                className={`absolute size-4 opacity-0 transition-opacity ease-in ${isOpen ? 'duration-200' : 'opacity-100 duration-200 delay-100'}`}
              />
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};
