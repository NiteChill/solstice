import { useTheme } from 'next-themes';
import { Dropdown, Label } from '@heroui/react';
import { Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  {
    key: 'light',
    icon: <Sun className="size-3.5 text-muted" />,
    label: 'Light',
  },
  {
    key: 'dark',
    icon: <Moon className="size-3.5 text-muted" />,
    label: 'Dark',
  },
  {
    key: 'system',
    icon: <Monitor className="size-3.5 text-muted" />,
    label: 'System',
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown.SubmenuTrigger>
      <Dropdown.Item>
        {themes.map(({ key, icon }) => key === (theme || 'system') && icon)}
        <Label>Theme</Label>
        <Dropdown.SubmenuIndicator />
      </Dropdown.Item>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectionMode="single"
          selectedKeys={new Set([theme || 'system'])}
          disallowEmptySelection
          onSelectionChange={(keys) => setTheme(Array.from(keys)[0] as string)}
          shouldCloseOnSelect={false}
        >
          {themes.map(({ key, icon, label }) => (
            <Dropdown.Item key={key} id={key} textValue={label}>
              <Dropdown.ItemIndicator />
              {icon}
              <Label>{label}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.SubmenuTrigger>
  );
}
