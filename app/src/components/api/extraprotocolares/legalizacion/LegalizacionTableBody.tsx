import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useGetLegalizaciones from "../../../../hooks/api/extraprotocolares/legalizacion/useGetLegalizaciones"
import useAuthStore from "../../../../store/useAuthStore"
import Paginator from "../../../ui/Paginator"
import LegalizacionCard from "./LegalizacionCard"
import { emptyMotionProps } from "../rowMotion"

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

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess)
  return (
    <>
        {legalizaciones.results.length > 0 ? (
            <div className="pb-2">
                {legalizaciones.results.map((legalizacion, index) => (
                    <LegalizacionCard 
                        key={legalizacion.idlegalizacion}
                        legalizacion={legalizacion}
                        index={index}
                    />
                ))}
            </div>
        ) : (
            <motion.p {...emptyMotionProps} className="text-center text-xs my-4 pb-4 text-slate-500">No hay legalizaciones disponibles</motion.p>
        )}
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={legalizaciones.count} 
        />
    </>
  )
}

export default LegalizacionTableBody