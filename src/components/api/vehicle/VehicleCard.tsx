import { Vehicle } from "../../../services/api/vehicleService"
import RemoveVehicle from "./RemoveVehicle"
import UpdateVehicle from "./UpdateVehicle"

interface Props {
    vehicle: Vehicle
}

const VehicleCard = ({ vehicle }: Props) => {
  return (
    <div className="grid grid-cols-7 gap-4 text-black text-xs p-2 my-2">
        <p>{vehicle.idplaca}</p>
        <p>{vehicle.numplaca}</p>
        <p>{vehicle.clase}</p>
        <p>{vehicle.marca}</p>
        <p>{vehicle.color}</p>
        <p>{vehicle.motor}</p>
        <div className="flex gap-4">
          <RemoveVehicle 
            kardex={vehicle.kardex}
            idVehicular={vehicle.detveh}
          />
          |
          <UpdateVehicle 
            vehicle={vehicle}
          />
        </div>
    </div>
  )
}

export default VehicleCard