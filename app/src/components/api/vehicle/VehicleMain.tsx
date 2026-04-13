import CreateVehicle from "./CreateVehicle"
import VehicleTable from "./VehicleTable"

interface Props {
    kardex: string
    idtipoacto: string
}

const VehicleMain = ({ kardex, idtipoacto }: Props) => {
  return (
    <>
        {idtipoacto 
        ? 
        <>
        <CreateVehicle 
            kardex={kardex}
            idtipoacto={idtipoacto} 
        />
        <VehicleTable 
            kardex={kardex}
            idtipoacto={idtipoacto} 
        />
        </> 
        : 
        <p className="text-center text-xs my-6">Es necesario crear un patrimonial primero</p>
        }
    </>
  )
}

export default VehicleMain