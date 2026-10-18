import type { Dispatch, SetStateAction } from "react"
import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useGetTemplates from "../../../hooks/api/templates/useGetTemplates"
import Paginator from "../../ui/Paginator"
import LoadingState from "../../ui/LoadingState"
import ExtraTableShell from "../extraprotocolares/ExtraTableShell"
import { emptyMotionProps } from "../extraprotocolares/rowMotion"
import PlantillaCard from "./PlantillaCard"

interface Props {
    codeActs: string
    fkType: string
    nameTemplate: string
    page: number
    setPage: Dispatch<SetStateAction<number>>
    hideDelete?: boolean
}

const PantillaList = ({ codeActs, fkType, nameTemplate, page, setPage, hideDelete = false }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error } = useGetTemplates({
        access,
        codeActs,
        fkType,
        nameTemplate,
        page,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    if (isLoading) {
        return <LoadingState message="Cargando plantillas…" description="Documentos del catálogo" />
    }

    if (isError) {
        return (
            <p className="my-8 text-center text-sm text-rose-600">
                {error instanceof Error ? error.message : "No se pudieron cargar las plantillas."}
            </p>
        )
    }

    return (
        <ExtraTableShell
            count={itemsCount}
            label="plantillas encontradas"
            hint={hideDelete ? "Descargue la plantilla que necesite" : "Descargue o elimine plantillas"}
            minWidth="640px"
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
                    <p className="text-sm font-medium text-slate-600">No hay plantillas con estos filtros</p>
                </motion.div>
            ) : (
                <ul className="divide-y divide-slate-100">
                    {results.map((template, index) => (
                        <li key={template.pktemplate}>
                            <PlantillaCard
                                template={template}
                                hideDelete={hideDelete}
                                index={index}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </ExtraTableShell>
    )
}

export default PantillaList
