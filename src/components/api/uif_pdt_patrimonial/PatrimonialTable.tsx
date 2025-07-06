import useGetDetalleMedioDePagoByKardex from "../../../hooks/api/detalleMedioDePago/useGetDetalleMedioDePagoByKardex"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"
import PatrimonialTableBody from "./PatrimonialTableBody"
import PatrimonialTableHeader from "./PatrimonialTableHeader"

interface Props {
    kardex: Kardex
}

const PatrimonialTable = ({ kardex }: Props) => {

  const access = useAuthStore(s => s.access_token) || ''
  const { data: mediosDePago,  } = useGetDetalleMedioDePagoByKardex({ access, kardex: kardex.kardex })

  return (
    <>
        <>{console.log('mediosDePago', mediosDePago)}</>
        <PatrimonialTableHeader />
        <PatrimonialTableBody 
            kardex={kardex}
        />
    </>
  )
}

export default PatrimonialTable