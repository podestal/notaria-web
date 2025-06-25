import { Car } from "lucide-react"
import { useState } from "react"
import TopModal from "../../ui/TopModal"
import VehicleForm from "./VehicleForm"
import useCreateVehicular from "../../../hooks/api/vehiculares/useCreateVehicular"

interface Props {
    kardex: string
    idtipoacto: string
}

const CreateVehicle = ({ kardex, idtipoacto }: Props) => {

    const [open, setOpen] = useState(false)
    const createVehicle = useCreateVehicular()

  return (
    <>
        <button
            className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
            type="button"
            onClick={() => setOpen(true)}
        >
            <Car />
            <p className="text-xs">Nuevo</p>
        </button>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <VehicleForm 
                createVehicle={createVehicle}
                kardex={kardex}
                idtipoacto={idtipoacto}
            />
        </TopModal>
    </>
  )
}

export default CreateVehicle