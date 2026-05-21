import { Dropdown, Label, Separator } from '@heroui/react';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { ThemeSwitcher } from '../../../components/theme-switcher';

export const AuthActionPopover = () => {
  const { logout } = useAuth();
  return (
    <Dropdown.Popover>
      <Dropdown.Menu>
        <Dropdown.Item href="#settings" id="settings" textValue="Settings">
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
