import { Link, buttonVariants, Modal, ModalFooter } from '@heroui/react';
import { useAuth } from '../hooks/use-auth';
import { User } from 'lucide-react';

export const GlobalAuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  return (
    <Modal.Backdrop isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <Modal.Container size="sm">
        <Modal.Dialog className="items-center text-center">
          <Modal.CloseTrigger />
          <Modal.Header className="items-center">
            <Modal.Icon className="bg-surface-secondary">
              <User className="size-4" />
            </Modal.Icon>
            <Modal.Heading>Create an account</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="font-medium">
            Create an account and start your adventure with Solstice.
          </Modal.Body>
          <ModalFooter className="flex-col w-full">
            <Link
              href="/auth/login"
              onPress={() => setIsAuthModalOpen(false)}
              className={buttonVariants({ fullWidth: true })}
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onPress={() => setIsAuthModalOpen(false)}
              className={buttonVariants({
                fullWidth: true,
                variant: 'tertiary',
              })}
            >
              Sign up
            </Link>
          </ModalFooter>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
