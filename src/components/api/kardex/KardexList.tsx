import { useState } from "react"
import useGetKardexList from "../../../hooks/api/kardex/useGetKardexList"
import KardexTable from "./KardexTable"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"

const KardexList = () => {

    const [page, setPage] = useState(1)
    const bodyRender = useBodyRenderStore(s => s.bodyRender)

    const { data: kardexPage, isLoading, isError, error, isSuccess } = useGetKardexList({ page: page.toString(), idtipkar:bodyRender })

    if (isLoading) return <p className="text-sm animate-pulse text-center my-10">Un momento</p>
  
    if (isError) return <p>Error: {error.message}</p>
  
    if (isSuccess)

  return (
    <div>
        <>{console.log('kardexPage', kardexPage)}</>
        <>{console.log("setpage", setPage)}</>
        <KardexTable 
        />
    </div>
  )
}

export default KardexList