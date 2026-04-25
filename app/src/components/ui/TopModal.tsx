import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface TopModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  deepth?: number; // Optional prop to control z-index depth
}

const TopModal = ({ isOpen, onClose, children, deepth }: TopModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={`fixed inset-y-0 right-0 left-56 bg-black/40 ${deepth ? `z-${deepth}` : 'z-40'}`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            className="fixed top-20 right-0 left-56 z-50 mx-auto w-full max-w-5xl rounded-b-2xl bg-white p-6 shadow-lg max-h-screen overflow-y-auto"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={onClose} className="text-red-500 hover:text-red-700 cursor-pointer">
                ✕
              </button>
            </div>
            {/* Modal content */}
            <div className="mt-2 overflow-y-auto max-h-[75vh]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TopModal
