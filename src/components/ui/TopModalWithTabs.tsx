import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  notAllowed?: boolean;
}

interface TopModalWithTabsProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
}

const TopModalWithTabs = ({ isOpen, onClose, tabs }: TopModalWithTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

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

          {/* Modal Container */}
          <motion.div
            className="fixed top-20 left-0 right-0 z-50 mx-auto max-w-6xl w-full bg-white rounded-b-2xl shadow-lg overflow-hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex h-[70vh]">
              {/* Tabs Sidebar */}
              <div className="w-48 bg-slate-100 pt-12 border-r border-slate-200 p-4 flex flex-col gap-2">
                <div className="absolute top-2 left-4">
                  <button onClick={onClose} className="text-red-500 hover:text-red-700 text-lg hover:cursor-pointer">
                    ✕
                  </button>
                </div>
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled
                    className={`text-left px-4 py-2 rounded-lg transition-all font-medium text-sm
                        ${tab.notAllowed && 'opacity-50 cursor-not-allowed'}
                        ${
                            activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-slate-700 hover:bg-slate-200'
                        }`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto relative">

                {/* Active Tab Content */}
                <div className="mt-6">
                  {tabs.find((tab) => tab.id === activeTab)?.content}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TopModalWithTabs;
