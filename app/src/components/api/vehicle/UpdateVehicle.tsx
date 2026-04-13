import { Pencil } from "lucide-react";
import TopModal from "../../ui/TopModal";
import { useState } from "react";
import VehicleForm from "./VehicleForm";
import { Vehicle } from "../../../services/api/vehicleService";
import useUpdateVehicular from "../../../hooks/api/vehiculares/useUpdateVehicular";

interface Props {
    vehicle: Vehicle
}


const UpdateVehicle = ({ vehicle }: Props) => {

    const updateVehicular = useUpdateVehicular({ kardex: vehicle.kardex, vehicleId: vehicle.detveh });
    const [open, setOpen] = useState(false);

  return (
    <>
    <button
        onClick={() =>{
            setOpen(true)}}
    >
        <Pencil 
            size={20}
            className="text-blue-500 hover:text-blue-400 cursor-pointer"
        />
    </button>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <VehicleForm 
                kardex={vehicle.kardex}
                idtipoacto={vehicle.idtipacto}
                vehicle={vehicle}
                updateVehicular={updateVehicular}
            />
        </TopModal>

    </>
  )
}

export default UpdateVehicle