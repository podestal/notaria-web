import ContratantesTableBody from "./ContratantesTableBody"
import ContratantesTableHeader from "./ContratantesTableHeader"

interface Props {
    idPoder: number;
}

const ContratantesTable = ({ idPoder }: Props) => {
  return (
    <>
        <ContratantesTableHeader />
        <ContratantesTableBody idPoder={idPoder} />
    </>
  )
}

export default ContratantesTable