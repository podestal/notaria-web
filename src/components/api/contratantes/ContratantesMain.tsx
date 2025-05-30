import { Kardex } from "../../../services/api/kardexService"
import ContratantesTable from "./ContratantesTable"
import CreateContratante from "./CreateContratante"

interface Props {
    kardex: Kardex
}

const ContratantesMain = ({ kardex }: Props) => {
  return (
    <>
        <ContratantesTable 
            kardex={kardex} 
        />
        <CreateContratante />
    </>
  )
}

export default ContratantesMain