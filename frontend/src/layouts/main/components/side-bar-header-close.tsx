import { Button, Tooltip } from '@heroui/react';
import { Logo } from '../../../components/logo';
import { PanelLeftOpen } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { SideBarHeaderCollapseButtonTooltip } from './side-bar-header-collapse-button-tooltip';

interface SideBarHeaderCloseProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const SideBarHeaderClose = ({ setIsOpen }: SideBarHeaderCloseProps) => (
  <div className="py-3 pr-3 pl-3 text-muted mb-1">
    <Tooltip delay={0}>
      <Button
        variant="ghost"
        size="lg"
        isIconOnly
        onPress={() => setIsOpen((prev) => !prev)}
        className="group"
      >
        <Logo className="size-6 group-hover:hidden group-focus-visible:hidden" />
        <PanelLeftOpen className="text-muted hidden group-hover:block group-focus-visible:block" />
      </Button>
      <SideBarHeaderCollapseButtonTooltip isSidebarOpen={false} />
    </Tooltip>
  </div>
);
