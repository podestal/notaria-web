import { useState } from "react";
import CreateParticipante from "./CreateParticipante"
import ParticipantesTableBody from "./ParticipantesTableBody"

interface Props {
    viajeId: number;
}

const ParticipantesTable = ({ viajeId }: Props) => {
  const [participantesDocs, setParticipantesDocs] = useState<string[]>([]);

  return (
    <>
        <CreateParticipante 
            viajeId={viajeId}
            participantesDocs={participantesDocs}
        />
        <ParticipantesTableBody viajeId={viajeId} setParticipantesDocs={setParticipantesDocs} />
    </>
  )
}

export default ParticipantesTable
