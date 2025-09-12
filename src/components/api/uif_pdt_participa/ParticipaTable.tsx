import { Contratante } from "../../../services/api/contratantesService"
import ParticipaTableBody from "./ParticipaTableBody"
import ParticipaTableHeader from "./ParticipaTableHeader"

interface Props {
    contratantes: Contratante[]
    detalleActo: string
}

const ParticipaTable = ({ contratantes, detalleActo }: Props) => {

  console.log('contratantes', contratantes)

  return (
    <>
        <ParticipaTableHeader />
        <ParticipaTableBody 
            contratantes={contratantes}
            detalleActo={detalleActo}
        />
    </>
  )
}

export default ParticipaTable