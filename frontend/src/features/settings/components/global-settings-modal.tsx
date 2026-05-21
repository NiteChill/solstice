import { Breadcrumbs, Modal } from '@heroui/react';
import { useGlobalSettingsModal } from '../hooks/use-global-settings-modal';
import { SideBar } from './side-bar';

export const GlobalSettingsModal = () => {
  const { isOpen, handleOpenChange, Outlet, breadcrumbs } =
    useGlobalSettingsModal();
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container>
        <Modal.Dialog
          className="h-130 md:h-100 max-w-none sm:max-w-130 md:max-w-150 p-0 pb-15 md:pb-0 md:pl-48 flex-col-reverse md:flex-row"
          aria-label="settings"
        >
          <Modal.CloseTrigger />
          <SideBar />
          <Modal.Body className="flex flex-col">
            <Modal.Header className="flex p-4 shrink-0">
              <Modal.Heading title="Sessions">
                <Breadcrumbs className="h-7">
                  {breadcrumbs.map(({ label, path }) => (
                    <Breadcrumbs.Item key={label} href={path}>
                      {label}
                    </Breadcrumbs.Item>
                  ))}
                </Breadcrumbs>
                {/*{activeRoute?.label}*/}
              </Modal.Heading>
            </Modal.Header>
            <section className="flex-1 overflow-y-auto overflow-x-hidden pb-3 md:pb-0">
              <Outlet />
            </section>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
