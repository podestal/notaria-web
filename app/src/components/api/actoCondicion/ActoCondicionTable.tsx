import { motion } from "framer-motion"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import type { Tipokardex } from "../../../services/api/tipokardexService"
import { tipokarDescripcion } from "../../../utils/actoTipokarLabel"
import {
    EXTRA_HEADER_CLASS,
    EXTRA_ID_BADGE_CLASS,
    EXTRA_ROW_CLASS,
} from "../extraprotocolares/ExtraTableShell"

interface Props {
    actos: Acto[]
    tiposKardex: Tipokardex[]
    onSelectActo: (acto: Acto) => void
}

export const ACTO_GRID_COLUMNS =
    "minmax(90px,0.8fr) minmax(200px,2.2fr) minmax(140px,1.4fr) 90px 80px 90px 70px 100px"

const Empty = () => <span className="text-slate-300">—</span>

const rowMotion = (index: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
        duration: 0.28,
        delay: Math.min(index, 16) * 0.03,
        ease: "easeOut" as const,
    },
})

const ActoCondicionTable = ({ actos, tiposKardex, onSelectActo }: Props) => {
    return (
        <div className="overflow-x-auto">
            <div style={{ minWidth: 960 }}>
                <div
                    className={EXTRA_HEADER_CLASS}
                    style={{ gridTemplateColumns: ACTO_GRID_COLUMNS }}
                >
                    <p>Tipo acto</p>
                    <p>Descripción</p>
                    <p>Tipo kardex</p>
                    <p>Cód. SUNAT</p>
                    <p>Impuesto</p>
                    <p>Cód. UIF</p>
                    <p>Umbral</p>
                    <p>Cod. SISGEN</p>
                </div>
                <div className="divide-y divide-slate-100">
                    {actos.map((acto, index) => (
                        <motion.div
                            key={`${acto.idtipoacto}-${acto.idtipkar}-${index}`}
                            {...rowMotion(index)}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelectActo(acto)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    onSelectActo(acto)
                                }
                            }}
                            className={`${EXTRA_ROW_CLASS} cursor-pointer`}
                            style={{ gridTemplateColumns: ACTO_GRID_COLUMNS }}
                        >
                            <div>
                                <span className={EXTRA_ID_BADGE_CLASS}>{acto.idtipoacto}</span>
                            </div>
                            <p className="leading-snug text-slate-800">{acto.desacto || <Empty />}</p>
                            <p className="leading-snug text-slate-600">
                                {tipokarDescripcion(acto.idtipkar, tiposKardex) || <Empty />}
                            </p>
                            <p className="font-mono text-[11px] text-slate-600">{acto.actosunat || <Empty />}</p>
                            <p className="tabular-nums text-slate-700">{acto.impuestos ?? <Empty />}</p>
                            <p className="font-mono text-[11px] text-slate-600">{acto.actouif || <Empty />}</p>
                            <p className="tabular-nums text-slate-700">{acto.umbral ?? <Empty />}</p>
                            <p className="font-mono text-[11px] text-slate-600">
                                {(acto.cod_ancert || acto.codigo_ancert || "").trim() || <Empty />}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ActoCondicionTable
