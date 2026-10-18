import { useMemo, useState, type Dispatch, type SetStateAction } from "react"
import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"
import useGetActosPage from "../../../hooks/api/acto/useGetActosPage"
import Paginator from "../../ui/Paginator"
import LoadingState from "../../ui/LoadingState"
import ExtraTableShell from "../extraprotocolares/ExtraTableShell"
import { emptyMotionProps } from "../extraprotocolares/rowMotion"
import ActoCondicionTable from "./ActoCondicionTable"
import ActoCondicionCard from "./ActoCondicionCard"
import ActoDetalleModal from "./ActoDetalleModal"

interface Props {
    desacto: string
    idtipoacto: string
    idtipkar: string
    page: number
    setPage: Dispatch<SetStateAction<number>>
}

const ActoCondicionList = ({ desacto, idtipoacto, idtipkar, page, setPage }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [selectedActo, setSelectedActo] = useState<Acto | null>(null)
    const { data: tiposKardexRaw } = useGetTipoKardexList()
    const tiposKardex = useMemo(() => (Array.isArray(tiposKardexRaw) ? tiposKardexRaw : []), [tiposKardexRaw])

    const { data, isLoading, isError, error } = useGetActosPage({
        access,
        desacto,
        idtipoacto,
        idtipkar,
        page,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    if (isLoading) {
        return <LoadingState message="Cargando actos…" description="Tipos de acto y condición" />
    }

    if (isError) {
        return (
            <p className="my-8 text-center text-sm text-rose-600">
                {error instanceof Error ? error.message : "No se pudieron cargar los actos."}
            </p>
        )
    }

    return (
        <>
            <ExtraTableShell
                count={itemsCount}
                label="actos encontrados"
                hint="Haga clic en una fila para ver el detalle"
                minWidth="960px"
                footer={
                    <Paginator page={page} setPage={setPage} itemsCount={itemsCount} itemsPerPage={10} />
                }
            >
                {results.length === 0 ? (
                    <motion.div
                        {...emptyMotionProps}
                        className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <FileSearch className="h-5 w-5" aria-hidden />
                        </span>
                        <p className="text-sm font-medium text-slate-600">No hay actos con estos filtros</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="hidden md:block">
                            <ActoCondicionTable
                                actos={results}
                                tiposKardex={tiposKardex}
                                onSelectActo={setSelectedActo}
                            />
                        </div>
                        <ul className="space-y-3 p-3 md:hidden">
                            {results.map((acto, index) => (
                                <li key={`${acto.idtipoacto}-${acto.idtipkar}-${index}`}>
                                    <ActoCondicionCard
                                        acto={acto}
                                        tiposKardex={tiposKardex}
                                        onSelectActo={setSelectedActo}
                                        index={index}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </ExtraTableShell>

            <ActoDetalleModal
                acto={selectedActo}
                isOpen={selectedActo !== null}
                onClose={() => setSelectedActo(null)}
                onActoUpdated={(a) => setSelectedActo(a)}
            />
        </>
    )
}

export default ActoCondicionList
