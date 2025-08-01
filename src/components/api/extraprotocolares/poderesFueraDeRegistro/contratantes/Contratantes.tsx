import ContratantesTable from "./ContratantesTable"
import CreateContratantes from "./CreateContratantes"

interface Props {
    idPoder: number;
}

const Contratantes = ({ idPoder }: Props) => {
  return (
    <>
        <CreateContratantes poderId={idPoder} />
        <ContratantesTable idPoder={idPoder} />
    </>
  )
}

export default Contratantes