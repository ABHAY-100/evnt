import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal = ({ isOpen, onClose, title, message }: SuccessModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      backdrop="blur"
      placement="center"
      classNames={{
        backdrop: "bg-black/50 backdrop-opacity-40",
        base: "border-2 border-white/40 border-dashed bg-black rounded-none mx-2",
        header: "border-b-2 border-white/40 border-dashed rounded-none",
        body: "py-6 rounded-none",
        closeButton: "absolute top-3 right-3 hover:bg-white/10 active:bg-white/20 w-8 h-8",
        wrapper: "!items-center w-full px-4"
      }}
    >
      <ModalContent className="m-auto">
        <button 
          onClick={onClose}
          className="absolute p-2 top-3 right-3 w-8 h-8 flex items-center justify-center border-2 border-white/40 border-dashed hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M1 1L13 13M1 13L13 1" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
        <ModalHeader className="flex flex-col justify-center gap-1 text-white">{title}</ModalHeader>
        <ModalBody>
          <p className="text-white/80">{message}</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
