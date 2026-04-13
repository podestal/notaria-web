import { Kardex } from "../../../services/api/kardexService"
import ContratantesTableBody from "./ContratantesTableBody"
import ContratantesTableHeader from "./ContratantesTableHeader"

interface Props {
    kardex: Kardex
}

const ContratantesTable = ({ kardex }: Props) => {
  return (
    <div className="overflow-x-auto my-4 flex-col">
        <ContratantesTableHeader />
        <ContratantesTableBody 
            kardex={kardex}
        />
    </div>
  )
}

export default ContratantesTable