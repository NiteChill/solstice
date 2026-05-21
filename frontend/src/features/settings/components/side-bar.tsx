import { Tabs, type Key } from '@heroui/react';
import { NavButton } from '../../../components/nav-button';
import { SETTINGS_ROUTES } from '../settings-router';
import { useGlobalSettingsModal } from '../hooks/use-global-settings-modal';

export const SideBar = () => {
  const { activeRoute, navigate } = useGlobalSettingsModal();
  return (
    <Tabs
      className="absolute bottom-2 left-2 right-2 md:top-2 bg-surface rounded-3xl md:w-45 h-auto shrink-0 z-50 shadow-md"
      orientation="vertical"
      selectedKey={activeRoute.path}
      onSelectionChange={(key: Key) => navigate(`#settings/${key.toString()}`)}
    >
      <Tabs.ListContainer className="w-full h-full rounded-[inherit]">
        <Tabs.List className="bg-surface-secondary/50 rounded-[inherit] w-full h-full p-3 gap-2 md:gap-1 flex-row md:flex-col justify-between md:justify-start overflow-x-auto md:overflow-y-auto">
          {SETTINGS_ROUTES.map(({ icon: Icon, label, path }) => (
            <NavButton
              key={path}
              id={path}
              icon={<Icon />}
              label={label}
              className="w-fit shrink-0 md:w-full hover:bg-surface-secondary/60!"
              indicatorProps={{ className: 'bg-surface-tertiary' }}
            />
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
