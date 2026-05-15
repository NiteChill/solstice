import { Button, Dropdown } from '@heroui/react';
import { Header } from '../layouts/main/header';
import { Menu, Plus } from 'lucide-react';
import { AuthActionPopover } from '../features/auth/components/account-action-popover';
import { useAuth } from '../features/auth/hooks/use-auth';

export const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <>
      <Header
        leftSlot={
          <Button isIconOnly variant="ghost" size="lg">
            <Plus className="size-5" />
          </Button>
        }
        centerSlot={
          <h1 className="text-lg font-medium">{user!.displayName}</h1>
        }
        rightSlot={
          <Dropdown>
            <Button isIconOnly variant="ghost" size="lg">
              <Menu className="size-5" />
            </Button>
            <AuthActionPopover />
          </Dropdown>
        }
      />
      Profile
    </>
  );
};
