import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import KardexErrors from "./kardexErrors/KardexErrors"
import KardexFilters from "./KardexFilters"
import KardexHeader from "./KardexHeader"
import KardexTable from "./KardexTable"
import useGetKardexList from "../../../hooks/api/kardex/useGetKardexList"
import useAuthStore from "../../../store/useAuthStore"

const kardexTypes: Record<number, string> = {
    1: import.meta.env.VITE_KARDEX_PREFIX_1 || 'KAR',
    2: import.meta.env.VITE_KARDEX_PREFIX_2 || 'NCT',
    3: import.meta.env.VITE_KARDEX_PREFIX_3 || 'ACT',
    4: import.meta.env.VITE_KARDEX_PREFIX_4 || 'GAM',
    5: import.meta.env.VITE_KARDEX_PREFIX_5 || 'TES',
}

const KardexMain = () => {

    const [searchParams] = useSearchParams()
    const setBodyRender = useBodyRenderStore(s => s.setBodyRender)
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const [correlative, setCorrelative] = useState(kardexTypes[bodyRender])
    const [name, setName] = useState('')
    const [document, setDocument] = useState('')
    const [numescritura, setNumescritura] = useState('')
    const [page, setPage] = useState(1)
    const idtipkar = useBodyRenderStore(s => s.bodyRender)
    const access = useAuthStore(s => s.access_token) || ''

    useEffect(() => {
        const tipkarParam = searchParams.get('tipkar')
        if (tipkarParam) {
            const id = parseInt(tipkarParam, 10)
            if (!Number.isNaN(id) && id !== bodyRender) {
                setBodyRender(id)
                return
            }
        }
    }, [searchParams, bodyRender, setBodyRender])

    useEffect(() => {
        setCorrelative(kardexTypes[bodyRender])
        setPage(1)
        setName('')
        setDocument('')
        setNumescritura('')
    }, [bodyRender])

    const { data: kardexPage, isLoading, isError, error, isSuccess, refetch } = useGetKardexList({ page: page.toString(), idtipkar, access, correlative, name, document, numescritura })

    if (isLoading) return <p className="text-sm animate-pulse text-center my-10">Un momento</p>
  
    if (isError) return <p className="text-center my-8">{`Error: ${error.message}`}</p>
  
    if (isSuccess)

  return (
    <div className="mx-auto w-[92%] max-w-[1400px] bg-white rounded-2xl shadow-sm border border-slate-200 text-black mt-4 mb-4 overflow-hidden">
        {bodyRender !== 0 
        ?
        <>
          <KardexHeader />
          <KardexFilters 
            setCorrelative={setCorrelative}
            setName={setName}
            setDocument={setDocument}
            setNumescritura={setNumescritura}
            correlative={correlative}
            name={name}
            document={document}
            numescritura={numescritura}
            refetch={refetch}
          />
          <KardexTable 
            kardexPage={kardexPage}
            setPage={setPage}
            page={page}
          />
        </>
        :
        <KardexErrors />}
    </div>
  )
}

export default KardexMain