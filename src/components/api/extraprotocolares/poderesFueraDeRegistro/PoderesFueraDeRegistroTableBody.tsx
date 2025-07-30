import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import { useEffect } from "react"

interface Props {
    poderes: IngresoPoderesPage | undefined
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IngresoPoderesPage, Error>>
}


const PoderesFueraDeRegistroTableBody = ({ poderes, refetch }: Props) => {

    useEffect(() => {
refetch({})  // Refetching the data when the component mounts or updates
    }, [])

  return (
    <div>
        <>{console.log('poderes',poderes)}</>
    </div>
  )
}

export default PoderesFueraDeRegistroTableBody