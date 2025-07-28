import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import TopModal from "../../../../ui/TopModal";
import ParticipantesTable from "./ParticipantesTable";

interface Props {
    viajeId: number;
}

const Participantes = ({ viajeId }: Props) => {

    const [open, setOpen] = useState(false);

  return (
    <>
        <div 
            onClick={() => setOpen(true)}
            className=" w-full h-fit flex items-center justify-start px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-green-600 hover:opacity-85 cursor-pointer">
            <UserRoundPlus className="text-xl"/>
            <p className="text-xs text-blue-600">Participantes</p>
        </div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <ParticipantesTable 
                viajeId={viajeId}
            />
        </TopModal>
    </>
  )
}

export default Participantes