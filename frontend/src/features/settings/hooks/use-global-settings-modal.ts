import { SETTINGS_ROUTES } from '../settings-router';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  Breadcrumb,
  SettingsChildrenRoute,
  SettingsRoute,
} from '../../../types/settings';

export const useGlobalSettingsModal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hash = location.hash ?? '';
  const isOpen = hash.startsWith('#settings');

  const { rootRoute, activeComponent, currentBreadcrumbs } = useMemo(() => {
    const rawPath = isOpen
      ? hash.replace('#settings', '').replace(/^\//, '')
      : '';
    const segments = rawPath ? rawPath.split('/').filter(Boolean) : [];

    let currentRoot = SETTINGS_ROUTES[0];
    let currentComp = currentRoot.component;
    const breadcrumbs: Breadcrumb[] = [];

    let currentRouteList: (SettingsRoute | SettingsChildrenRoute)[] =
      SETTINGS_ROUTES;
    let accumulatedPath = '#settings';

    if (segments.length === 0) {
      breadcrumbs.push({
        label: currentRoot.label,
        path: `${accumulatedPath}/${currentRoot.path}`,
      });
    } else {
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const match = currentRouteList.find((route) => route.path === segment);

        if (!match) break;

        if (i === 0) currentRoot = match as SettingsRoute;

        accumulatedPath += `/${match.path}`;
        currentComp = match.component;

        breadcrumbs.push({
          label: match.label,
          path: accumulatedPath,
        });

        if (match.children) {
          currentRouteList = match.children;
        } else {
          break;
        }
      }
    }

    return {
      rootRoute: currentRoot,
      activeComponent: currentComp,
      currentBreadcrumbs: breadcrumbs,
    };
  }, [hash, isOpen]);

  const lastValidRootRef = useRef(rootRoute);
  const lastValidComponentRef = useRef(activeComponent);
  const lastValidBreadcrumbsRef = useRef(currentBreadcrumbs);

  const [activeRoot, setActiveRoot] = useState(rootRoute);
  const [OutletComponent, setOutletComponent] = useState(() => activeComponent);
  const [breadcrumbs, setBreadcrumbs] = useState(currentBreadcrumbs);

  useEffect(() => {
    if (isOpen) {
      lastValidRootRef.current = rootRoute;
      lastValidComponentRef.current = activeComponent;
      lastValidBreadcrumbsRef.current = currentBreadcrumbs;
    }
    setActiveRoot(isOpen ? rootRoute : lastValidRootRef.current);
    setOutletComponent(() =>
      isOpen ? activeComponent : lastValidComponentRef.current,
    );
    setBreadcrumbs(
      isOpen ? currentBreadcrumbs : lastValidBreadcrumbsRef.current,
    );
  }, [rootRoute, activeComponent, currentBreadcrumbs, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open)
      navigate(`${location.pathname ?? '/home'}${location.search ?? ''}`, {
        replace: true,
      });
  };

  return {
    isOpen,
    handleOpenChange,
    Outlet: OutletComponent,
    activeRoute: activeRoot,
    breadcrumbs,
    navigate,
  };
};
