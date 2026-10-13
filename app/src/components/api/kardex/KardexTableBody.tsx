import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { Kardex, KardexPage } from "../../../services/api/kardexService"
import KardexCard from "./KardexCard"

interface Props {
    kardexList: KardexPage | Kardex[]
    readyOnly?: boolean
}

const KardexTableBody = ({ kardexList, readyOnly }: Props) => {
    const rows = Array.isArray(kardexList) ? kardexList : []

    if (rows.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
            >
                <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                >
                    <FileSearch className="h-5 w-5" aria-hidden />
                </motion.span>
                <p className="text-sm font-medium text-slate-600">No se encontraron kardex</p>
                <p className="text-xs text-slate-400">Pruebe con otros filtros de búsqueda.</p>
            </motion.div>
        )
    }

  return (
    <div className="divide-y divide-slate-100">
        {rows.map((singleKardex, index) => (
            <KardexCard 
                key={singleKardex.idkardex}
                kardex={singleKardex}
                readyOnly={readyOnly}
                index={index}
            />
        ))}
    </div>
  )
}

export default KardexTableBody
