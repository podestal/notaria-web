import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroTableBody from "./PoderesFueraDeRegistroTableBody"
import PoderesFueraDeRegistroTableHeader from "./PoderesFueraDeRegistroTableHeader"

interface Props {
    poderes: IngresoPoderesPage | undefined
    page: number
    readyOnly?: boolean
}

const PoderesFueraDeRegistroTable = ({ poderes, page, readyOnly }: Props) => {



  return (
    <>
    <PoderesFueraDeRegistroTableHeader />
    <PoderesFueraDeRegistroTableBody 
      poderes={poderes}
      page={page}
      readyOnly={readyOnly}
    />
    </>
  )
}

export default PoderesFueraDeRegistroTable