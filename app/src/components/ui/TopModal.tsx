import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TopModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  deepth?: number; // Optional prop to control z-index depth
  /** Render at document.body (use for modals opened inside another modal). */
  portal?: boolean;
  /** Wider modal for split layouts (e.g. SISGEN kardex + errors). */
  wide?: boolean;
}

const TopModal = ({ isOpen, onClose, children, deepth, portal = false, wide = false }: TopModalProps) => {
  const overlayZIndex = deepth ?? 40
  const contentZIndex = overlayZIndex + 10

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-y-0 right-0 left-56 bg-black/40"
            style={{ zIndex: overlayZIndex }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            className={
              wide
                ? "fixed top-12 right-3 left-56 z-50 flex h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-b-2xl bg-white p-4 shadow-lg sm:p-6"
                : `fixed top-20 right-0 left-56 z-50 mx-auto w-full max-h-screen overflow-y-auto rounded-b-2xl bg-white p-6 shadow-lg max-w-5xl`
            }
            style={{ zIndex: contentZIndex }}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <div className="flex shrink-0 justify-end">
              <button 
                type="button"
                onClick={onClose} className="text-red-500 hover:text-red-700 cursor-pointer">
                ✕
              </button>
            </div>
            {/* Modal content */}
            <div
              className={
                wide
                  ? "mt-1 flex min-h-0 flex-1 flex-col overflow-y-auto"
                  : "mt-2 max-h-[75vh] overflow-y-auto"
              }
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }

  return modal;
}

export default TopModal
