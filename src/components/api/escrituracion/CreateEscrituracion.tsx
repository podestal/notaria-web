import useUpdateKardex from "../../../hooks/api/kardex/useUpdateKardex"
import { Kardex } from "../../../services/api/kardexService"
import EscrituracionForm from "./EscrituracionForm"

interface Props {
    kardex: Kardex
}

const CreateEscrituracion = ({ kardex }: Props) => {

  const updateKardex = useUpdateKardex({ kardexId: kardex.idkardex })

  return (
    <>
    <EscrituracionForm 
      kardex={kardex} 
      updateKardex={updateKardex}
    />
    </>
  )
}

export default CreateEscrituracion