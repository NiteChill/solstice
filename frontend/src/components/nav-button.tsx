import { Tabs, type TabProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface SideBarButtonProps extends TabProps {
  icon: ReactNode;
  label: string;
  displayLabel?: boolean;
}

export const NavButton = ({
  icon,
  label,
  displayLabel = true,
  ...props
}: SideBarButtonProps) => {
  return (
    <Tabs.Tab
      {...props}
      className={`${props.className} min-w-0 justify-start gap-3 px-3 h-9 hover:bg-surface opacity-100 rounded-2xl`}
    >
      <span>{icon}</span>
      <span
        className={`transition-opacity duration-300 ease-in ${displayLabel ? 'opacity-100' : 'opacity-0'}`}
      >
        {label}
      </span>
      <Tabs.Indicator className="bg-default rounded-2xl" />
    </Tabs.Tab>
  );
};
