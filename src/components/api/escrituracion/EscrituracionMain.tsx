import { Kardex } from "../../../services/api/kardexService"
import CreateEscrituracion from "./CreateEscrituracion"

interface Props {
    kardex: Kardex
}

const EscrituracionMain = ({ kardex }: Props) => {

    console.log('Kardex in EscrituracionMain:', kardex);
    
  return (
    <>
        <CreateEscrituracion />
    </>
  )
}

export default EscrituracionMain