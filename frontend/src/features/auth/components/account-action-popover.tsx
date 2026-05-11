import { Dropdown, Label, Separator } from '@heroui/react';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { ThemeSwitcher } from '../../../components/theme-switcher';

interface AuthActionPopoverProps {
  excludeProfile?: boolean;
}

export const AuthActionPopover = ({
  excludeProfile = false,
}: AuthActionPopoverProps) => {
  const { logout } = useAuth();
  return (
    <Dropdown.Popover className="w-59">
      <Dropdown.Menu>
        {!excludeProfile && (
          <Dropdown.Item href="/profile" id="profile" textValue="Profile">
            <User className="size-3.5 text-muted" />
            <Label>Profile</Label>
          </Dropdown.Item>
        )}
        <Dropdown.Item id="settings" textValue="Settings">
          <Settings className="size-3.5 text-muted" />
          <Label>Settings</Label>
        </Dropdown.Item>
        <ThemeSwitcher />
        <Separator />
        <Dropdown.Item
          id="logout"
          textValue="Logout"
          variant="danger"
          onPress={logout}
        >
          <LogOut className="size-3.5 text-danger" />
          <Label>Log Out</Label>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  );
};
