import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SendHorizontal, ShieldCheck } from "lucide-react";
import KardexFormTabs from "../kardex/KardexFormTabs"
import SisgenBody from "./SisgenBody"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";
import useUserInfoStore from "../../../hooks/store/useGetUserInfo";


const SisgenMain = () => {
  const user = useUserInfoStore((s) => s.user);
  const isSuperuser = Number(user?.is_superuser) !== 0;

  const [sisgenDocs, setSisgenDocs] = useState<SISGENDocument[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [noDocsMessage, setNoDocsMessage] = useState('')

  if (!isSuperuser) {
    return <Navigate to="/app/protocolares" replace />;
  }

  const extraFunction = () => {
    setSisgenDocs([]);
    setItemsCount(0);
    setPage(1);
    setNoDocsMessage('')
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto mb-10 mt-[80px] w-[92%] max-w-[1400px] text-slate-800"
    >
        <div className="keep-dark relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-50 shadow-lg">
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                        className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5"
                    >
                        <SendHorizontal className="text-sky-300" />
                    </motion.div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Módulo</p>
                        <h2 className="text-lg font-semibold text-white">SISGEN</h2>
                        <p className="text-xs text-slate-400">Envío y seguimiento de documentos al Sistema de Gestión Notarial</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-slate-200">
                    <ShieldCheck size={16} className="text-emerald-300" />
                    <p className="text-xs font-semibold">Solo administradores</p>
                </div>
            </div>
        </div>
        <KardexFormTabs 
            extraFunction={extraFunction}
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'escrituras', label: 'Escrituras', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Escrituras Públicas" instrumentType={1} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/>},
                { id: 'transferencias', label: 'Transferencias', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Transferencias Vehiculares" instrumentType={3} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'garantias', label: 'Garantías', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Garantías Inmobiliarias" instrumentType={4} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'no-contenciosos', label: 'No Contenciosos', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="No Contenciosos" instrumentType={2} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'libros', label: 'Libros', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Libros Contables" instrumentType={5} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
            ]}
        />
    </motion.div>
  )
}

export default SisgenMain