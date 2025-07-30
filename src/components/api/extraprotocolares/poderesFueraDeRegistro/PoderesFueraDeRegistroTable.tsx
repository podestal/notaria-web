import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroTableBody from "./PoderesFueraDeRegistroTableBody"
import PoderesFueraDeRegistroTableHeader from "./PoderesFueraDeRegistroTableHeader"

interface Props {
    poderes: IngresoPoderesPage | undefined
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IngresoPoderesPage, Error>>
}

const PoderesFueraDeRegistroTable = ({ poderes, refetch }: Props) => {



  return (
    <>
    <PoderesFueraDeRegistroTableHeader />
    <PoderesFueraDeRegistroTableBody 
      poderes={poderes}
      refetch={refetch}
    />
    </>
  )
}

export default PoderesFueraDeRegistroTable