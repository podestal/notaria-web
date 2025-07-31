import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroTableBody from "./PoderesFueraDeRegistroTableBody"
import PoderesFueraDeRegistroTableHeader from "./PoderesFueraDeRegistroTableHeader"

interface Props {
    poderes: IngresoPoderesPage | undefined
    page: number
}

const PoderesFueraDeRegistroTable = ({ poderes, page }: Props) => {



  return (
    <>
    <PoderesFueraDeRegistroTableHeader />
    <PoderesFueraDeRegistroTableBody 
      poderes={poderes}
      page={page}
    />
    </>
  )
}

export default PoderesFueraDeRegistroTable