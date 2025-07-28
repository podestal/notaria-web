import CreateParticipante from "./CreateParticipante"
import ParticipantesTableBody from "./ParticipantesTableBody"
import ParticipantesTableHeader from "./ParticipantesTableHeader"


const ParticipantesTable = () => {
  return (
    <>
        <CreateParticipante />
        <ParticipantesTableHeader />
        <ParticipantesTableBody />
    </>
  )
}

export default ParticipantesTable