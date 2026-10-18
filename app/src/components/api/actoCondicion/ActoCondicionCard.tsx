import { motion } from "framer-motion"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import type { Tipokardex } from "../../../services/api/tipokardexService"
import { tipokarDescripcion } from "../../../utils/actoTipokarLabel"
import { EXTRA_ID_BADGE_CLASS } from "../extraprotocolares/ExtraTableShell"

interface Props {
    acto: Acto
    tiposKardex: Tipokardex[]
    onSelectActo: (acto: Acto) => void
    index?: number
}

const Empty = () => <span className="text-slate-300">—</span>

const ActoCondicionCard = ({ acto, tiposKardex, onSelectActo, index = 0 }: Props) => {
    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: Math.min(index, 12) * 0.03 }}
            whileHover={{ y: -1 }}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-sky-300 hover:bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-sky-200"
            onClick={() => onSelectActo(acto)}
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-slate-900">{acto.desacto}</h3>
                <span className={EXTRA_ID_BADGE_CLASS}>{acto.idtipoacto}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600">
                <div>
                    <dt className="font-medium uppercase tracking-wide text-slate-400">Tipo kardex</dt>
                    <dd className="mt-0.5 text-slate-800">{tipokarDescripcion(acto.idtipkar, tiposKardex) || <Empty />}</dd>
                </div>
                <div>
                    <dt className="font-medium uppercase tracking-wide text-slate-400">Impuesto</dt>
                    <dd className="mt-0.5 tabular-nums text-slate-800">{acto.impuestos ?? <Empty />}</dd>
                </div>
                <div>
                    <dt className="font-medium uppercase tracking-wide text-slate-400">Cód. SUNAT</dt>
                    <dd className="mt-0.5 font-mono">{acto.actosunat || <Empty />}</dd>
                </div>
                <div>
                    <dt className="font-medium uppercase tracking-wide text-slate-400">Cód. UIF</dt>
                    <dd className="mt-0.5 font-mono">{acto.actouif || <Empty />}</dd>
                </div>
                <div>
                    <dt className="font-medium uppercase tracking-wide text-slate-400">Umbral</dt>
                    <dd className="mt-0.5 tabular-nums">{acto.umbral ?? <Empty />}</dd>
                </div>
                <div>
                    <dt className="font-medium uppercase tracking-wide text-slate-400">Cod. SISGEN</dt>
                    <dd className="mt-0.5 font-mono">
                        {(acto.cod_ancert || acto.codigo_ancert || "").trim() || <Empty />}
                    </dd>
                </div>
            </dl>
        </motion.button>
    )
}

export default ActoCondicionCard
