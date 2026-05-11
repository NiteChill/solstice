import { Link, buttonVariants, Button, Tooltip } from '@heroui/react';
import { Logo } from '../../../components/logo';
import { PanelLeftClose } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { SideBarHeaderCollapseButtonTooltip } from './side-bar-header-collapse-button-tooltip';

interface SideBarHeaderOpenProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const SideBarHeaderOpen = ({ setIsOpen }: SideBarHeaderOpenProps) => (
  <div className="py-3 px-3 text-muted flex items-center mb-1 relative">
    <Link
      href="/home"
      className={buttonVariants({
        isIconOnly: true,
        variant: 'ghost',
        size: 'lg',
      })}
    >
      <Logo className="size-6" />
    </Link>
    <Tooltip delay={0}>
      <Button
        variant="ghost"
        className="absolute right-2"
        isIconOnly
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <PanelLeftClose className="text-muted" />
      </Button>
      <SideBarHeaderCollapseButtonTooltip isSidebarOpen />
    </Tooltip>
  </div>
);
