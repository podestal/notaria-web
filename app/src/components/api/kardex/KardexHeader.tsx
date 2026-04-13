import { LibraryBig, Search } from "lucide-react"
import CreateKardex from "./CreateKardex"

const KardexHeader = () => {
  return (
    <div className="w-full flex justify-between items-center bg-slate-700 p-4 rounded-t-lg text-slate-50">
        <div className="flex items-center gap-2">
          <LibraryBig 
            className="text-green-700"
          />
          <h2 className="text-amber-500">Instrumentos Protocolares</h2>
        </div>
        <div className="flex justify-center items-center gap-8 text-sm">
            <CreateKardex />
            <span>|</span>
            <div className="flex items-center gap-2 hover:opacity-80 cursor-pointer">
            <Search 
              size={20}
              className="text-blue-400"
            />
            <p className="border-b-2 border-amber-500 pb-1">Kardex</p>
            </div>
        </div>
    </div>
  )
}

export default KardexHeader