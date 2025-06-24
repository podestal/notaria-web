import VehicleTableBody from "./VehicleTableBody"
import VehicleTableHeader from "./VehicleTableHeader"

interface Props {
    kardex: string
}

const VehicleTable = ({ kardex }: Props) => {
  return (
    <>
        <VehicleTableHeader />
        <VehicleTableBody 
            kardex={kardex}
        />
    </>
  )
}

export default VehicleTable