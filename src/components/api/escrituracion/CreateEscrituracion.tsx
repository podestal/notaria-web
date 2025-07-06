import { Kardex } from "../../../services/api/kardexService"
import EscrituracionForm from "./EscrituracionForm"

interface Props {
    kardex: Kardex
}

const CreateEscrituracion = ({ kardex }: Props) => {
  return (
    <>
    <EscrituracionForm 
      kardex={kardex} 
    />
    </>
  )
}

export default CreateEscrituracion