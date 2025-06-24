import CreateVehicle from "./CreateVehicle"
import VehicleTable from "./VehicleTable"

interface Props {
    kardex: string
}

const VehicleMain = ({ kardex }: Props) => {
  return (
    <>
        <CreateVehicle />
        <VehicleTable 
            kardex={kardex}
        />
    </>
  )
}

export default VehicleMain