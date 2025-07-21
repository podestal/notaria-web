import { UseMutationResult } from "@tanstack/react-query"
import useGetUbigeos from "../../../hooks/api/ubigeo/useGetUbigeos"
import { DetalleBien } from "../../../services/api/detalleBienService"
import DetalleBienForm from "./DetalleBienForm"
import { DetalleBienCreateData } from "../../../hooks/api/detalleBien/useCreateDetalleBienes"

interface Props {
    detalleBien?: DetalleBien
    kardex: string
    idtipoacto: string
    itemmp: string
    createDetalleBien?: UseMutationResult<DetalleBien, Error, DetalleBienCreateData>
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PreDetalleBienForm = ({ detalleBien, kardex, idtipoacto, itemmp, createDetalleBien, setOpen }: Props) => {

    const { data: ubigeos, isLoading, isError, error, isSuccess } = useGetUbigeos()

    if (isLoading) return <p className="text-center animate-pulse my-4">Cargando...</p>

    if (isError) return <p className="text-center text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess)

  return (
    <DetalleBienForm 
        ubigeos={ubigeos}
        detalleBien={detalleBien}
        kardex={kardex}
        idtipoacto={idtipoacto}
        itemmp={itemmp}
        createDetalleBien={createDetalleBien}
        setOpen={setOpen}
    />
  )
}

export default PreDetalleBienForm