import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import useGetLegalizaciones from "../../../../hooks/api/extraprotocolares/legalizacion/useGetLegalizaciones"
import useAuthStore from "../../../../store/useAuthStore"
import Paginator from "../../../ui/Paginator"
import LegalizacionCard from "./LegalizacionCard"
import ExtraTableShell from "../ExtraTableShell"
import LegalizacionTableHeader from "./LegalizacionTableHeader"
import { emptyMotionProps } from "../rowMotion"
import LoadingState from "../../../ui/LoadingState"

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
}

const LegalizacionTableBody = ({ dateFrom, dateTo }: Props) => {
    const [page, setPage] = useState(1)
    const access = useAuthStore(s => s.access_token) || ''

    useEffect(() => {
        setPage(1)
    }, [dateFrom, dateTo])

    const { data: legalizaciones, isLoading, isError, error, isSuccess } = useGetLegalizaciones({ access, page, dateFrom, dateTo })

    if (isLoading) return <LoadingState message="Cargando legalizaciones…" />
    if (isError) return <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>

    if (!isSuccess) return null

  return (
    <ExtraTableShell
      count={legalizaciones.count}
      label="legalizaciones encontradas"
      hint="Haga clic en una fila para abrir la legalización"
      minWidth="640px"
      footer={
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={legalizaciones.count}
        />
      }
    >
      <LegalizacionTableHeader />
      {legalizaciones.results.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {legalizaciones.results.map((legalizacion, index) => (
            <LegalizacionCard
              key={legalizacion.idlegalizacion}
              legalizacion={legalizacion}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FileSearch className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm font-medium text-slate-600">No hay legalizaciones disponibles</p>
        </motion.div>
      )}
    </ExtraTableShell>
  )
}

export default LegalizacionTableBody
