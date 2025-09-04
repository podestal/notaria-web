import { useState } from "react";
import CreateParticipante from "./CreateParticipante"
import ParticipantesTableBody from "./ParticipantesTableBody"
import ParticipantesTableHeader from "./ParticipantesTableHeader"

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
        <ParticipantesTableHeader />
        <ParticipantesTableBody viajeId={viajeId} setParticipantesDocs={setParticipantesDocs} />
    </>
  )
}

export default ParticipantesTable