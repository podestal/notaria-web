import { Dispatch, SetStateAction, useEffect } from "react"
import useAuthStore from "../../../../store/useAuthStore"
import useGetEscriturasPdt from "../../../../hooks/api/kardex/pdt/useGetEscriturasPdt"
import useGetGarantiasPdt from "../../../../hooks/api/kardex/pdt/useGetGarantiasPdt"
import useGetVehicularesPdt from "../../../../hooks/api/kardex/pdt/useGetVehicularesPdt"
import useGetLibrosPdt from "../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibrosPdt"
import LoadingState from "../../../ui/LoadingState"
import Paginator from "../../../ui/Paginator"
import ArchivosPdtKardexHeader from "./pdtKardex/ArchivosPdtKardexHeader"
import ArchivosPdtKardexBody from "./pdtKardex/ArchivosPdtKardexBody"
import ArchivosPdtLibrosHeader from "./PDTLibros/ArchivosPdtLibrosHeader"
import ArchivosPdtLibrosBody from "./PDTLibros/ArchivosPdtLibrosBody"
import type { PdtTypeId } from "./archivosPdtTypes"

interface SharedProps {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    page: number
    setPage: Dispatch<SetStateAction<number>>
    onRefetchReady: (refetch: () => Promise<unknown>) => void
}

interface Props extends SharedProps {
    pdtType: PdtTypeId
}

const EmptyDates = () => (
    <p className="py-10 text-center text-sm text-slate-500">
        Seleccione un rango de fechas y genere el archivo PDT.
    </p>
)

const EscriturasPanel = ({ dateFrom, dateTo, page, setPage, onRefetchReady }: SharedProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const query = useGetEscriturasPdt({ access, page, dateFrom, dateTo })

    useEffect(() => {
        onRefetchReady(() => query.refetch())
    }, [query.refetch, onRefetchReady])

    if (!dateFrom || !dateTo) return <EmptyDates />
    if (query.isLoading) {
        return <LoadingState message="Cargando PDT…" description="Consultando operaciones" />
    }
    if (query.isError) {
        return <p className="my-8 text-center text-sm text-red-600">{query.error.message}</p>
    }
    if (!query.isSuccess || !query.data) return null

    return (
        <>
            <ArchivosPdtKardexHeader
                dateFrom={dateFrom}
                dateTo={dateTo}
                count={query.data.results.totalRecords}
                errors={query.data.results.totalError}
                refetch={query.refetch}
                typeKardex={1}
                typeKardexName="Escrituras"
            />
            <ArchivosPdtKardexBody
                errors={query.data.results.list}
                onCorrected={() => {
                    void query.refetch()
                }}
            />
            <Paginator page={page} setPage={setPage} itemsCount={query.data.count} />
        </>
    )
}

const GarantiasPanel = ({ dateFrom, dateTo, page, setPage, onRefetchReady }: SharedProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const query = useGetGarantiasPdt({ access, page, dateFrom, dateTo })

    useEffect(() => {
        onRefetchReady(() => query.refetch())
    }, [query.refetch, onRefetchReady])

    if (!dateFrom || !dateTo) return <EmptyDates />
    if (query.isLoading) {
        return <LoadingState message="Cargando PDT…" description="Consultando operaciones" />
    }
    if (query.isError) {
        return <p className="my-8 text-center text-sm text-red-600">{query.error.message}</p>
    }
    if (!query.isSuccess || !query.data) return null

    return (
        <>
            <ArchivosPdtKardexHeader
                dateFrom={dateFrom}
                dateTo={dateTo}
                count={query.data.results.totalRecords}
                errors={query.data.results.totalError}
                refetch={query.refetch}
                typeKardex={4}
                typeKardexName="Garantias"
            />
            <ArchivosPdtKardexBody
                errors={query.data.results.list}
                onCorrected={() => {
                    void query.refetch()
                }}
            />
            <Paginator page={page} setPage={setPage} itemsCount={query.data.count} />
        </>
    )
}

const VehicularesPanel = ({ dateFrom, dateTo, page, setPage, onRefetchReady }: SharedProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const query = useGetVehicularesPdt({ access, page, dateFrom, dateTo })

    useEffect(() => {
        onRefetchReady(() => query.refetch())
    }, [query.refetch, onRefetchReady])

    if (!dateFrom || !dateTo) return <EmptyDates />
    if (query.isLoading) {
        return <LoadingState message="Cargando PDT…" description="Consultando operaciones" />
    }
    if (query.isError) {
        return <p className="my-8 text-center text-sm text-red-600">{query.error.message}</p>
    }
    if (!query.isSuccess || !query.data) return null

    return (
        <>
            <ArchivosPdtKardexHeader
                dateFrom={dateFrom}
                dateTo={dateTo}
                count={query.data.results.totalRecords}
                errors={query.data.results.totalError}
                refetch={query.refetch}
                typeKardex={3}
                typeKardexName="Transferencias"
            />
            <ArchivosPdtKardexBody
                errors={query.data.results.list}
                onCorrected={() => {
                    void query.refetch()
                }}
            />
            <Paginator page={page} setPage={setPage} itemsCount={query.data.count} />
        </>
    )
}

const LibrosPanel = ({ dateFrom, dateTo, page, setPage, onRefetchReady }: SharedProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const query = useGetLibrosPdt({ access, page, dateFrom, dateTo })

    useEffect(() => {
        onRefetchReady(() => query.refetch())
    }, [query.refetch, onRefetchReady])

    if (!dateFrom || !dateTo) return <EmptyDates />
    if (query.isLoading) {
        return <LoadingState message="Cargando PDT…" description="Consultando operaciones" />
    }
    if (query.isError) {
        return <p className="my-8 text-center text-sm text-red-600">{query.error.message}</p>
    }
    if (!query.isSuccess || !query.data) return null

    return (
        <>
            <ArchivosPdtLibrosHeader dateFrom={dateFrom} dateTo={dateTo} count={query.data.count} />
            <ArchivosPdtLibrosBody errors={query.data.results} />
            <Paginator page={page} setPage={setPage} itemsCount={query.data.count} />
        </>
    )
}

const ArchivosPdtPanel = ({ pdtType, ...shared }: Props) => {
    useEffect(() => {
        shared.setPage(1)
    }, [pdtType, shared.dateFrom, shared.dateTo, shared.setPage])

    if (pdtType === "escrituras") return <EscriturasPanel {...shared} />
    if (pdtType === "garantias") return <GarantiasPanel {...shared} />
    if (pdtType === "vehiculares") return <VehicularesPanel {...shared} />
    return <LibrosPanel {...shared} />
}

export default ArchivosPdtPanel
