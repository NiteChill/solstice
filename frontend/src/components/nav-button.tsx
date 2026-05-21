import { Tabs, type TabIndicatorProps, type TabProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface SideBarButtonProps extends TabProps {
  icon: ReactNode;
  label: string;
  displayLabel?: boolean;
  indicatorProps?: TabIndicatorProps;
}

export const NavButton = ({
  icon,
  label,
  displayLabel = true,
  indicatorProps,
  ...props
}: SideBarButtonProps) => {
  return (
    <Tabs.Tab
      {...props}
      className={`${props.className} min-w-0 justify-start gap-3 px-3 h-9 rounded-2xl hover:bg-surface/60 opacity-100 focus-visible:z-50`}
    >
      <span>{icon}</span>
      <span
        className={`transition-opacity duration-300 ease-in ${displayLabel ? 'opacity-100' : 'opacity-0'}`}
      >
        {label}
      </span>
      <Tabs.Indicator
        {...indicatorProps}
        className={`bg-surface-secondary rounded-[inherit] ${indicatorProps?.className}`}
      />
    </Tabs.Tab>
  );
};
