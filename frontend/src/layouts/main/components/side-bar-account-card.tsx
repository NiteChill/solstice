import { Button, buttonVariants, Card, Dropdown, Link } from '@heroui/react';
import type { UserResponse } from '../../../types/auth';
import { Settings } from 'lucide-react';
import { AuthActionPopover } from '../../../features/auth/components/account-action-popover';
import { CustomAvatar } from '../../../components/custom-avatar';

interface SideBarAccountCardProps {
  user: UserResponse;
  isOpen: boolean;
}

export const SideBarAccountCard = ({
  user,
  isOpen,
}: SideBarAccountCardProps) => (
  <div className="flex items-center gap-2">
    <Dropdown>
      <Button className="w-full h-fit p-0 rounded-2xl group" variant="ghost">
        <Card
          className={`flex flex-row items-center text-left transition-padding ease-in bg-transparent duration-300 w-full shadow-none ${isOpen ? 'py-2 px-2.5' : 'p-1.5'}`}
        >
          <CustomAvatar user={user} className="size-9" />
          <div
            className={`flex flex-1 items-center transition-opacity ease-in duration-300 ${!isOpen && 'opacity-0'}`}
          >
            <div className="flex flex-1 flex-col">
              <h3 className="text-sm font-medium leading-tight">{user.name}</h3>
              <p className="text-xs text-muted leading-tight">
                {user.username}
              </p>
            </div>
            {/*<ChevronUp className="size-4 text-muted transform-rotate duration-300 ease-in-out group-data-pressed:rotate-180" />*/}
          </div>
        </Card>
      </Button>
      <AuthActionPopover />
    </Dropdown>
    {isOpen && (
      <Link
        href="#settings"
        className={buttonVariants({
          isIconOnly: true,
          variant: 'ghost',
          size: 'lg',
          className: 'duration-100 mr-1.5 shrink-0',
        })}
      >
        <Settings className="text-muted" />
      </Link>
    )}
  </div>
);
