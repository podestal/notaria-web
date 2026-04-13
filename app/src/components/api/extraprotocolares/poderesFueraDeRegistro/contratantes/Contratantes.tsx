import { useState } from "react";
import ContratantesTable from "./ContratantesTable"
import CreateContratantes from "./CreateContratantes"

interface Props {
    idPoder: number;
}

const Contratantes = ({ idPoder }: Props) => {

    const [contratantesDocs, setContratantesDocs] = useState<string[]>([]);

  return (
    <>
        <CreateContratantes poderId={idPoder} contratantesDocs={contratantesDocs} />
        <ContratantesTable idPoder={idPoder} setContratantesDocs={setContratantesDocs} />
    </>
  )
}

export default Contratantes