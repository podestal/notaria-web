import { useEffect, useState } from "react"
import moment from "moment"
import ReportHeader from "../../../ui/ReportHeader"
import ReportPageShell from "../../../ui/ReportPageShell"
import LoadingState from "../../../ui/LoadingState"
import ExtraProtocolaresHeader from "../cronologicos/ExtraProtocolaresHeader"
import useGetKardexList from "../../../../hooks/api/kardex/useGetKardexList"
import useAuthStore from "../../../../store/useAuthStore"
import KardexTable from "../../kardex/KardexTable"

interface Props {
    embedded?: boolean
    idtipkar: number
    url: string
    name: string
    title: string
}

const AlfabeticoReport = ({
    embedded = false,
    idtipkar,
    url,
    name,
    title,
}: Props) => {
    const [dateFrom, setDateFrom] = useState<Date | undefined>(() => {
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth(), 1)
    })
    const [dateTo, setDateTo] = useState<Date | undefined>(() => {
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth() + 1, 0)
    })
    const [page, setPage] = useState(1)
    const access = useAuthStore((s) => s.access_token) || ""

    useEffect(() => {
        setPage(1)
    }, [idtipkar, dateFrom, dateTo])

    const { data, isLoading, isError, error, isSuccess, refetch } = useGetKardexList({
        page: page.toString(),
        idtipkar,
        indexReport: "yes",
        access,
        dateFrom,
        dateTo,
    })

    return (
        <ReportPageShell embedded={embedded}>
            {!embedded && <ReportHeader title={title} />}
            <ExtraProtocolaresHeader
                dateFrom={dateFrom}
                dateTo={dateTo}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
                refetch={refetch}
                generatesWord
                generatesExcel
                url={url}
                params={{
                    initialDate: moment(dateFrom).format("YYYY-MM-DD") || "",
                    finalDate: moment(dateTo).format("YYYY-MM-DD") || "",
                }}
                name={name}
            />
            {isLoading && <LoadingState />}
            {isError && (
                <p className="my-8 text-center text-sm text-red-600">
                    Error: {error.message}
                </p>
            )}
            {isSuccess && data && (
                <KardexTable
                    kardexPage={data}
                    setPage={setPage}
                    page={page}
                    readyOnly
                />
            )}
        </ReportPageShell>
    )
}

export default AlfabeticoReport
