import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal = ({ isOpen, onClose, title, message }: SuccessModalProps) => {
  const renderMessage = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (!line) {
        return <div key={index} className="h-4" />; // Empty line spacing
      }
      
      if (line.startsWith('Group Link:')) {
        const [prefix, link] = line.split(': ');
        return (
          <div key={index} className="py-1">
            {prefix}: <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-400/80 underline"
              onClick={(e) => {
                e.preventDefault();
                window.open(link, '_blank');
              }}
            >
              {link}
            </a>
          </div>
        );
      }

      // Add padding to stat lines
      if (line.startsWith('•')) {
        return <div key={index} className="py-[2px]">{line}</div>;
      }

      return <div key={index} className="py-1">{line}</div>;
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      backdrop="blur"
      placement="center"
      classNames={{
        backdrop: "bg-black/60",
        base: "border-2 border-white/[0.20] border-dashed bg-black rounded-none mx-auto max-w-[720px] w-[95%] sm:w-[90%]",
        header: "border-b-2 border-white/[0.20] border-dashed rounded-none px-6",
        body: "py-6 px-6 rounded-none",
        closeButton: "hidden",
        wrapper: "!items-center"
      }}
    >
      <ModalContent className="m-auto relative">
        <button 
          onClick={onClose}
          className="absolute p-2 top-3 right-3 w-8 h-8 flex items-center justify-center border-2 border-white/[.20] border-dashed hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none"
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
          <div className="text-white/80 font-manrope space-y-1">
            {renderMessage(message)}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
