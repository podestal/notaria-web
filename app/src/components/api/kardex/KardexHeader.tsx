import { LibraryBig, Search } from "lucide-react"
import CreateKardex from "./CreateKardex"

const KardexHeader = () => {
  return (
    <div className="w-full flex justify-between items-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 text-slate-50">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/15 p-2 border border-sky-400/30">
          <LibraryBig 
            className="text-sky-300"
          />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Módulo</p>
            <h2 className="text-lg font-semibold text-white">Instrumentos Protocolares</h2>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 text-sm">
            <CreateKardex />
            <div className="h-8 w-px bg-slate-600" />
            <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-slate-200">
            <Search 
              size={16}
              className="text-sky-300"
            />
            <p className="text-xs font-semibold">Kardex</p>
            </div>
        </div>
    </div>
  )
}

export default KardexHeader