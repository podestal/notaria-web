import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { UserPlus, Users } from "lucide-react"
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo"
import TopModal from "../../../ui/TopModal"
import CreateUser from "../../../auth/CreateUser"
import UserMappingMain from "../userMapping/UserMappingMain"
import UsuariosManageTab from "./UsuariosManageTab"

type UsuariosTab = "usuarios" | "enlazar"

const UsuariosConfigMain = () => {
    const user = useUserInfoStore((s) => s.user)
    const isSuperuser = Number(user?.is_superuser) !== 0
    const [searchParams, setSearchParams] = useSearchParams()
    const requestedTab = searchParams.get("tab")
    const tab: UsuariosTab =
        requestedTab === "enlazar" && isSuperuser ? "enlazar" : "usuarios"

    const switchTab = (next: UsuariosTab) => {
        if (next === tab) return
        if (next === "enlazar") {
            setSearchParams({ tab: "enlazar" }, { replace: true })
            return
        }
        setSearchParams({}, { replace: true })
    }

    const [createOpen, setCreateOpen] = useState(false)

    const tabs = [
        { id: "usuarios" as const, label: "Usuarios" },
        ...(isSuperuser
            ? [{ id: "enlazar" as const, label: "Enlazar usuarios" }]
            : []),
    ]

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
            <div className="keep-dark relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-100">
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.45, 0.75, 0.45] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
                            className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5"
                        >
                            <Users className="text-sky-300" size={22} />
                        </motion.div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">
                                Configuración
                            </p>
                            <h1 className="text-lg font-semibold text-white">Usuarios</h1>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Cree usuarios, revise la lista y asigne protocolares
                            </p>
                        </div>
                    </div>
                    <motion.button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.35 }}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/20 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/30"
                    >
                        <UserPlus className="h-3.5 w-3.5" aria-hidden />
                        Crear usuario
                    </motion.button>
                </div>
            </div>

            <div
                className="flex gap-1 border-b border-slate-200 bg-slate-50/70 px-4 pt-3"
                role="tablist"
                aria-label="Gestión de usuarios"
            >
                {tabs.map((item) => {
                    const active = tab === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => switchTab(item.id)}
                            className={`relative -mb-px rounded-t-lg border border-b-0 px-4 py-2.5 text-xs font-semibold transition-colors ${
                                active
                                    ? "border-slate-200 bg-white text-sky-700"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {item.label}
                            {active && (
                                <motion.span
                                    layoutId="usuarios-tab-underline"
                                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-sky-500"
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {tab === "usuarios" ? (
                <UsuariosManageTab />
            ) : (
                <UserMappingMain embedded />
            )}
        </motion.div>

        <TopModal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
            <CreateUser embedded onCreated={() => setCreateOpen(false)} />
        </TopModal>
        </>
    )
}

export default UsuariosConfigMain
