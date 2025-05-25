import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface TopModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const TopModal = ({ isOpen, onClose, children }: TopModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            className="fixed top-20 left-0 right-0 z-50 mx-auto max-w-4xl w-full bg-white rounded-b-2xl shadow-lg overflow-y-auto max-h-screen p-6"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <div className="flex justify-end">
              <button onClick={onClose} className="text-red-500 hover:text-red-700 cursor-pointer">
                ✕
              </button>
            </div>
            {/* Modal content */}
            <div className="mt-2 overflow-y-auto max-h-[75vh]">{children}
                <p>asdasdas</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TopModal
