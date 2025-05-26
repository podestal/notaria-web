import Header from '../router/Header'
import KardexMain from '../components/api/kardex/KardexMain'
import useGetTipoKardexList from '../hooks/api/tipoKardex/useGetTipoKardexList'
import { useEffect } from 'react'
import useKardexTypesStore from '../hooks/store/useKardexTypesStore'

const MainPage = () => {

  const setKardexTypes = useKardexTypesStore(s => s.setKardexTypes)
  const { data: kardexTypes, isLoading, isError, error, isSuccess } = useGetTipoKardexList()

  useEffect(() => {
    if (isSuccess) {
      setKardexTypes(kardexTypes)
    }
  }, [kardexTypes, isSuccess, setKardexTypes])

  useEffect(() => {

  })

  if (isLoading) return <p>Un momento</p>
  if (isError) return <p>Error: {error.message}</p>
  if (isSuccess) 

  return (
    <>
    <Header 
      kardexTypes={kardexTypes}
    />
    <KardexMain 

    />
    </>
  )
}

export default MainPage