import VehicleTableBody from "./VehicleTableBody"
import VehicleTableHeader from "./VehicleTableHeader"

interface Props {
    kardex: string
    idtipoacto?: string
}

const VehicleTable = ({ kardex, idtipoacto }: Props) => {
  return (
    <>
        <VehicleTableHeader />
        {idtipoacto ? 
        <VehicleTableBody 
            kardex={kardex}
            idtipoacto={idtipoacto}
        />
        :
        <p className="text-center my-6 text-xs">No hay datos vehiculares</p>}
    </>
  )
}

export default VehicleTable