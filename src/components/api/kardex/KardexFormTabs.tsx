import { motion } from "framer-motion"
import { ReactNode, useState } from "react";

interface Tab {
    id: string;
    label: string;
    content: ReactNode;
    notAllowed?: boolean;
}

interface Props {
    tabs: Tab[];
}

const KardexFormTabs = ({ tabs }: Props) => {

    const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '')

  return (
    <div className="flex flex-col h-full w-full">
        <div className="bg-slate-100 border-t border-slate-200 flex justify-center gap-2 p-4 sticky bottom-0 w-full">
            {tabs.map((tab) => (
                <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.notAllowed}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer
                    ${tab.notAllowed && 'opacity-50 cursor-not-allowed'}
                    ${
                        activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.03 }}
                >
                    {tab.label}
                </motion.button>
            ))}
        </div>
        <div className="flex-1 px-6 overflow-y-auto">
            {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
    </div>
  )
}

export default KardexFormTabs