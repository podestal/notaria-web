import { motion } from "framer-motion"
import { FileSearch, Pencil, Trash2 } from "lucide-react"
import { Abogado } from "../../../../../services/api/abogadosService"
import ExtraTableShell, {
    EXTRA_HEADER_CLASS,
    EXTRA_ID_BADGE_CLASS,
    EXTRA_ROW_CLASS,
} from "../../../extraprotocolares/ExtraTableShell"
import { emptyMotionProps } from "../../../extraprotocolares/rowMotion"

interface Props {
    abogados: Abogado[]
    onEdit: (abogado: Abogado) => void
    onDelete: (abogado: Abogado) => void
}

const GRID =
    "70px minmax(180px,2fr) minmax(110px,1fr) minmax(100px,0.9fr) minmax(100px,0.9fr) minmax(110px,1fr) 160px"

const valueOrDash = (value: string | null | undefined) => {
    const trimmed = (value ?? "").trim()
    return trimmed || null
}

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

const AbogadosTable = ({ abogados, onEdit, onDelete }: Props) => {
    return (
        <ExtraTableShell
            count={abogados.length}
            label="abogados encontrados"
            hint="Use Editar o Eliminar en cada fila"
            minWidth="900px"
        >
            <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: GRID }}>
                <p>ID</p>
                <p>Razón social</p>
                <p>Documento</p>
                <p>Teléfono</p>
                <p>Matrícula</p>
                <p>Distrito</p>
                <p className="text-right">Acciones</p>
            </div>

            {abogados.length === 0 ? (
                <motion.div
                    {...emptyMotionProps}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <FileSearch className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="text-sm font-medium text-slate-600">No hay abogados registrados</p>
                </motion.div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {abogados.map((abogado, index) => (
                        <motion.div
                            key={abogado.idabogado}
                            {...rowMotion(index)}
                            className={EXTRA_ROW_CLASS}
                            style={{ gridTemplateColumns: GRID }}
                        >
                            <div>
                                <span className={EXTRA_ID_BADGE_CLASS}>{abogado.idabogado}</span>
                            </div>
                            <p className="leading-snug font-medium text-slate-800">
                                {valueOrDash(abogado.razonsocial) || <Empty />}
                            </p>
                            <p className="font-mono text-[11px] text-slate-700">
                                {valueOrDash(abogado.documento) || <Empty />}
                            </p>
                            <p className="tabular-nums text-slate-600">
                                {valueOrDash(abogado.telefono) || <Empty />}
                            </p>
                            <p className="text-slate-600">{valueOrDash(abogado.matricula) || <Empty />}</p>
                            <p className="text-slate-600">{valueOrDash(abogado.distrito) || <Empty />}</p>
                            <div className="flex items-center justify-end gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => onEdit(abogado)}
                                    className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(abogado)}
                                    className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Eliminar
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </ExtraTableShell>
    )
}

export default AbogadosTable
