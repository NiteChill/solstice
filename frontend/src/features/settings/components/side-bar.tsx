import { Tabs, type Key } from '@heroui/react';
import { NavButton } from '../../../components/nav-button';
import { settingsRouter } from '../settings-router';
import { useGlobalSettingsModal } from '../hooks/use-global-settings-modal';

export const SideBar = () => {
  const { activePath, navigate } = useGlobalSettingsModal();
  return (
    <div className="w-full sm:w-40 h-auto sm:h-full overflow-x-auto sm:overflow-y-auto border-t sm:border-b-0 border-default-200">
      <Tabs
        className="flex-1 p-2 sm:py-3 sm:pl-3 sm:pr-1 w-fit sm:w-full"
        orientation="vertical"
        selectedKey={activePath}
        onSelectionChange={(key: Key) =>
          navigate(`#settings/${key.toString()}`)
        }
      >
        <Tabs.List className="bg-transparent w-full gap-2 sm:gap-0.5 p-0 flex-row sm:flex-col justify-start">
          {settingsRouter.map(({ icon: Icon, label, path }) => (
            <NavButton
              key={path}
              id={path}
              icon={<Icon />}
              label={label}
              className="w-fit shrink-0 sm:w-full"
            />
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
};
