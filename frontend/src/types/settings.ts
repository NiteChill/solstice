import type { ComponentType } from 'react';

export interface UpdateProfileRequest {
  name: string;
  username: string;
  bio?: string;
}

export interface SettingsRoute {
  path: string;
  label: string;
  component: ComponentType;
  icon: ComponentType;
  children?: SettingsChildrenRoute[];
}

export interface SettingsChildrenRoute extends Omit<SettingsRoute, 'icon'> {}

export interface Breadcrumb {
  label: string;
  path: string;
}
