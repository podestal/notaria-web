import { useState } from "react"
import useGetKardexList from "../../../hooks/api/kardex/useGetKardexList"
import KardexTable from "./KardexTable"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import useAuthStore from "../../../store/useAuthStore"

const KardexList = () => {
    const access = useAuthStore(s => s.access_token) || ''
    const [page, setPage] = useState(1)
    const bodyRender = useBodyRenderStore(s => s.bodyRender)

    const { data: kardexPage, isLoading, isError, error, isSuccess } = useGetKardexList({ page: page.toString(), idtipkar:bodyRender, access: '' })

    if (isLoading) return <p className="text-sm animate-pulse text-center my-10">Un momento</p>
  
    if (isError) return <p>Error: {error.message}</p>
  
    if (isSuccess)

  return (
    <div>
        <KardexTable 
          kardexPage={kardexPage}
          setPage={setPage}
          page={page}
        />
    </div>
  )
}

export default KardexList