import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroTableBody from "./PoderesFueraDeRegistroTableBody"
import PoderesFueraDeRegistroTableHeader from "./PoderesFueraDeRegistroTableHeader"

interface Props {
    poderes: IngresoPoderesPage | undefined
}

const PoderesFueraDeRegistroTable = ({ poderes }: Props) => {



  return (
    <>
    <PoderesFueraDeRegistroTableHeader />
    <PoderesFueraDeRegistroTableBody 
      poderes={poderes}
    />
    </>
  )
}

export default PoderesFueraDeRegistroTable