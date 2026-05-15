import { Modal } from '@heroui/react';
import { useGlobalSettingsModal } from '../hooks/use-global-settings-modal';
import { SideBar } from './side-bar';

export const GlobalSettingsModal = () => {
  const { isOpen, handleOpenChange, Outlet } = useGlobalSettingsModal();
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container>
        <Modal.Dialog
          className="h-130 max-w-140! sm:h-100 p-0"
          aria-label="settings"
        >
          <Modal.CloseTrigger className="z-50" />
          <Modal.Body className="flex flex-col-reverse sm:flex-row">
            <SideBar />
            <main className="flex-1 p-3 overflow-y-auto gap-2">
              <Outlet />
            </main>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
