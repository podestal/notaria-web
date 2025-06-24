import CreateVehicle from "./CreateVehicle"
import VehicleTable from "./VehicleTable"

interface Props {
    kardex: string
    idtipoacto?: string
}

const VehicleMain = ({ kardex, idtipoacto }: Props) => {
  return (
    <>
        <CreateVehicle />
        <VehicleTable 
            kardex={kardex}
            idtipoacto={idtipoacto} // Assuming idtipoacto is not needed here, otherwise pass it as a prop
        />
    </>
  )
}

export default VehicleMain