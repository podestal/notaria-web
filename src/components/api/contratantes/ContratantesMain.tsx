import { Kardex } from "../../../services/api/kardexService"
import ClientesCheck from "../clientes/ClientesCheck"
import ContratantesTable from "./ContratantesTable"

interface Props {
    kardex: Kardex
}

const ContratantesMain = ({ kardex }: Props) => {
  return (
    <>
        <ContratantesTable 
            kardex={kardex} 
        />
        <ClientesCheck 
            idtipoacto={kardex.codactos}
            idtipkar={kardex.idtipkar}
            kardex={kardex.kardex}
        />
    </>
  )
}

export default ContratantesMain