import { motion } from "framer-motion"
import KardexTableBody from "./KardexTableBody"
import KardexTableFooter from "./KardexTableFooter"
import KardexTableHeader from "./KardexTableHeader"
import { KardexPage } from "../../../services/api/kardexService"

interface Props {
    kardexPage: KardexPage
    setPage: React.Dispatch<React.SetStateAction<number>>
    page: number
    readyOnly?: boolean
}

const KardexTable = ({ kardexPage, setPage, page, readyOnly }: Props) => {


  return (
    <div className="p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <motion.span
                key={kardexPage.count}
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-block font-semibold text-slate-800"
              >
                {kardexPage.count}
              </motion.span>
              kardex encontrados
            </p>
            {!readyOnly && (
              <p className="text-[11px] text-slate-400">Haga clic en una fila para abrir el kardex</p>
            )}
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[1180px]">
              <KardexTableHeader />
              <KardexTableBody 
                  kardexList={kardexPage.results }
                  readyOnly={readyOnly}
              />
            </div>
          </div>
          <KardexTableFooter 
              page={page}
              setPage={setPage}
              kardexCount={kardexPage.count}
          />
        </div>
    </div>
  )
}

export default KardexTable
