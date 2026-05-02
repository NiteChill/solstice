import { useTheme } from 'next-themes';
import { Tabs } from '@heroui/react';
import { Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  { key: 'light', icon: <Sun /> },
  { key: 'dark', icon: <Moon /> },
  { key: 'system', icon: <Monitor /> },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs
      aria-label="Theme selection"
      selectedKey={theme}
      onSelectionChange={(key) => setTheme(key.toString())}
      className="w-fit fixed right-3 bottom-3"
    >
      <Tabs.List>
        {themes.map(({ key, icon: Icon }) => (
          <Tabs.Tab key={key} id={key} className="px-3">
            {Icon}
            <Tabs.Indicator />
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
