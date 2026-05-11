import { Outlet } from 'react-router-dom';
import { SideBar } from './side-bar';
import { BottomBar } from './bottom-bar';
import { GlobalAuthModal } from '../../features/auth/components/global-auth-modal';

export const MainLayout = () => {
  return (
    <>
      <GlobalAuthModal />
      <SideBar />
      <div className="flex flex-col flex-1">
        <main className="flex flex-col flex-1">
          <Outlet />
        </main>
        <BottomBar />
      </div>
    </>
  );
};
