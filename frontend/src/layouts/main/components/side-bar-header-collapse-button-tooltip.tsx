import { Kbd, Tooltip } from '@heroui/react';

interface SideBarHeaderCollapseButtonTooltipProps {
  isSidebarOpen: boolean;
}

export const SideBarHeaderCollapseButtonTooltip = ({
  isSidebarOpen,
}: SideBarHeaderCollapseButtonTooltipProps) => (
  <Tooltip.Content className="flex items-center gap-2 pr-1">
    {isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    <Kbd>
      <Kbd.Abbr keyValue="command" />
      <Kbd.Content>S</Kbd.Content>
    </Kbd>
  </Tooltip.Content>
);
