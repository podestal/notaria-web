import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { KardexROValid } from '../../../../../services/api/kardexService'
import { formatUifPatrimonial } from '../../../../../utils/uifCurrencyFormat'
import getTitleCase from '../../../../../utils/getTitleCase'
import { EXTRA_HEADER_CLASS, EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../../../extraprotocolares/ExtraTableShell"
import { emptyMotionProps, rowMotionProps } from "../../../extraprotocolares/rowMotion"

interface Props {
    kardexErrors: KardexROValid[]
}

const RO_GRID = "minmax(120px,1.1fr) minmax(200px,2fr) minmax(110px,1fr) minmax(130px,1.1fr)"

const ListaDeKardex = ({ kardexErrors }: Props) => {
  const rows = kardexErrors ?? []

  return (
    <div>
        <p className="mb-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{rows.length}</span>{" "}
            {rows.length === 1 ? "kardex en el RO" : "kardex en el RO"}
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <div style={{ minWidth: 720 }}>
                <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: RO_GRID }}>
                    <p>Kardex</p>
                    <p>Acto</p>
                    <p>Tipo de moneda</p>
                    <p>Patrimonial</p>
                </div>
                {rows.length === 0 ? (
                    <motion.div
                        {...emptyMotionProps}
                        className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <FileSearch className="h-5 w-5" aria-hidden />
                        </span>
                        <p className="text-sm font-medium text-slate-600">Sin kardex para el RO en este rango</p>
                    </motion.div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {rows.map((kardex, idx) => (
                            <motion.div
                                key={kardex.idkardex}
                                {...rowMotionProps(idx)}
                                className={EXTRA_ROW_CLASS}
                                style={{ gridTemplateColumns: RO_GRID }}
                            >
                                <div>
                                    <span className={EXTRA_ID_BADGE_CLASS}>{kardex.kardex}</span>
                                </div>
                                <p className="leading-snug text-slate-800">{getTitleCase(kardex.act || "") || "—"}</p>
                                <p className="text-slate-600">{kardex.tipo_moneda || "—"}</p>
                                <p className="tabular-nums font-medium text-slate-800">
                                    {formatUifPatrimonial({
                                        patrimonial: kardex.patrimonial,
                                        tipo_moneda: kardex.tipo_moneda,
                                        currency_symbol: kardex.currency_symbol,
                                    })}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ListaDeKardex
