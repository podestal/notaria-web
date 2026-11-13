import { useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FileSearch, Loader2 } from "lucide-react"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import { Kardex } from "../../../services/api/kardexService"
import { Contratante } from "../../../services/api/contratantesService"
import { groupContratantesBySide } from "../../../utils/sortContratantesDisplay"
import ContratanteCard from "./ContratanteCard"

interface Props {
    kardex: Kardex
}

const sectionMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.28, ease: "easeOut" as const },
}

const rowMotion = (index: number) => ({
    initial: { opacity: 0, y: -10, scale: 0.98 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            delay: Math.min(index, 12) * 0.035,
            ease: "easeOut" as const,
        },
    },
    exit: {
        opacity: 0,
        x: 36,
        scale: 0.96,
        transition: { duration: 0.22, ease: "easeIn" as const },
    },
})

const SectionHeader = ({
    title,
    count,
    tone,
}: {
    title: string
    count: number
    tone: "otorgante" | "beneficiario"
}) => (
    <div
        className={`flex items-center gap-2 border-y px-4 py-2 ${
            tone === "otorgante"
                ? "border-violet-100 bg-violet-50/70"
                : "border-emerald-100 bg-emerald-50/70"
        }`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${
                tone === "otorgante" ? "bg-violet-500" : "bg-emerald-500"
            }`}
        />
        <span
            className={`text-[11px] font-semibold uppercase tracking-wide ${
                tone === "otorgante" ? "text-violet-800" : "text-emerald-800"
            }`}
        >
            {title}
        </span>
        <motion.span
            key={`${title}-${count}`}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                tone === "otorgante"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-emerald-100 text-emerald-700"
            }`}
        >
            {count}
        </motion.span>
    </div>
)

const Section = ({
    title,
    items,
    kardex,
    tone,
}: {
    title: string
    items: Contratante[]
    kardex: Kardex
    tone: "otorgante" | "beneficiario"
}) => (
    <motion.div layout {...sectionMotion} className="overflow-hidden">
        <SectionHeader title={title} count={items.length} tone={tone} />
        <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout" initial={false}>
                {items.length === 0 ? (
                    <motion.p
                        key={`empty-${title}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-4 py-3 text-xs italic text-slate-400"
                    >
                        Sin {title.toLowerCase()}
                    </motion.p>
                ) : (
                    items.map((contratante, index) => (
                        <motion.div
                            key={contratante.idcontratante}
                            layout
                            {...rowMotion(index)}
                        >
                            <ContratanteCard
                                contratante={contratante}
                                kardex={kardex}
                            />
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    </motion.div>
)

const ContratantesTableBody = ({ kardex }: Props) => {
    const { data: contratantes, isLoading, isError, error, isSuccess } =
        useGetContratantesByKardex({ kardex: kardex.kardex })

    const grouped = useMemo(
        () =>
            groupContratantesBySide(
                Array.isArray(contratantes) ? (contratantes as Contratante[]) : [],
            ),
        [contratantes],
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 px-4 py-12 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Cargando contratantes…
            </div>
        )
    }

    if (isError) {
        return (
            <p className="px-4 py-8 text-center text-sm text-red-600">
                Error: {error.message}
            </p>
        )
    }

    if (!isSuccess) return null

    const list = Array.isArray(contratantes) ? contratantes : []
    if (list.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                    <FileSearch className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-medium text-slate-600">
                    No hay contratantes aún
                </p>
                <p className="text-xs text-slate-400">
                    Use Agregar contratante para registrar el primero.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="pb-1">
            <AnimatePresence mode="popLayout" initial={false}>
                <Section
                    key="otorgantes"
                    title="Otorgantes"
                    items={grouped.otorgantes}
                    kardex={kardex}
                    tone="otorgante"
                />
                <Section
                    key="beneficiarios"
                    title="Beneficiarios"
                    items={grouped.beneficiarios}
                    kardex={kardex}
                    tone="beneficiario"
                />
            </AnimatePresence>
        </div>
    )
}

export default ContratantesTableBody
