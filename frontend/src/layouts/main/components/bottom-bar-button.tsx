import { Tabs, type TabProps } from '@heroui/react';
import type { ReactNode } from 'react';

interface BottomBarButtonProps extends TabProps {
  icon: ReactNode;
}

export const BottomBarButton = ({ icon, ...props }: BottomBarButtonProps) => {
  return (
    <Tabs.Tab {...props} className={`${props.className} px-3 h-10 max-w-24`}>
      {icon}
      <Tabs.Indicator className="bg-surface-secondary" />
    </Tabs.Tab>
  );
};
