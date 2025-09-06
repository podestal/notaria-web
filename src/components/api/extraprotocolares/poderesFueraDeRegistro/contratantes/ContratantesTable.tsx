import { Dispatch, SetStateAction } from "react";
import ContratantesTableBody from "./ContratantesTableBody"
import ContratantesTableHeader from "./ContratantesTableHeader"

interface Props {
    idPoder: number;
    setContratantesDocs: Dispatch<SetStateAction<string[]>>;
}

const ContratantesTable = ({ idPoder, setContratantesDocs }: Props) => {
  return (
    <>
        <ContratantesTableHeader />
        <ContratantesTableBody idPoder={idPoder} setContratantesDocs={setContratantesDocs} />
    </>
  )
}

export default ContratantesTable