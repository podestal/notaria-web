import { Dispatch, SetStateAction } from "react";
import ContratantesTableBody from "./ContratantesTableBody"

interface Props {
    idPoder: number;
    setContratantesDocs: Dispatch<SetStateAction<string[]>>;
}

const ContratantesTable = ({ idPoder, setContratantesDocs }: Props) => {
  return (
    <ContratantesTableBody idPoder={idPoder} setContratantesDocs={setContratantesDocs} />
  )
}

export default ContratantesTable
