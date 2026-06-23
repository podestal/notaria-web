import { motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"

interface Tab {
    id: string
    label: string
    content: ReactNode
    notAllowed?: boolean
}

interface Props {
    tabs: Tab[]
    setFilter?: React.Dispatch<React.SetStateAction<string>>
    initialActiveTab?: string
    extraFunction?: () => void
}

const KardexFormTabs = ({
    tabs,
    setFilter,
    initialActiveTab,
    extraFunction,
}: Props) => {
    const [activeTab, setActiveTab] = useState(initialActiveTab || (tabs[0]?.id ?? ""))

    useEffect(() => {
        if (!initialActiveTab && setFilter) {
            setFilter(tabs[0]?.id ?? "")
        }
    }, [tabs[0]?.id, initialActiveTab, setFilter])

    const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/80 px-2 pt-2">
                <div className="flex gap-1 overflow-x-auto pb-0.5">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id

                        return (
                            <motion.button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setFilter?.(tab.id)
                                    setActiveTab(tab.id)
                                    extraFunction?.()
                                }}
                                disabled={tab.notAllowed}
                                className={`relative shrink-0 rounded-t-lg px-4 py-2.5 text-xs font-semibold transition ${
                                    tab.notAllowed
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer"
                                } ${
                                    isActive
                                        ? "bg-white text-sky-700 shadow-sm"
                                        : "text-slate-600 hover:bg-white/70 hover:text-slate-800"
                                }`}
                                whileTap={{ scale: 0.98 }}
                            >
                                {tab.label}
                                {isActive && (
                                    <motion.span
                                        layoutId="kardex-tab-indicator"
                                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-sky-600"
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
            <div className="min-h-[12rem] overflow-visible p-4 sm:p-6">{activeContent}</div>
        </div>
    )
}

export default KardexFormTabs
