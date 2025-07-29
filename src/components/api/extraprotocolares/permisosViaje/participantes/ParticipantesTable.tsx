import CreateParticipante from "./CreateParticipante"
import ParticipantesTableBody from "./ParticipantesTableBody"
import ParticipantesTableHeader from "./ParticipantesTableHeader"

interface Props {
    viajeId: number;
}


const ParticipantesTable = ({ viajeId }: Props) => {
  return (
    <>
        <CreateParticipante 
            viajeId={viajeId}
        />
        <ParticipantesTableHeader />
        <ParticipantesTableBody viajeId={viajeId} />
    </>
  )
}

export default ParticipantesTable