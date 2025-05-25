import Header from '../router/Header'
import KardexMain from '../components/api/kardex/KardexMain'
import useGetTipoKardexList from '../hooks/api/tipoKardex/useGetTipoKardexList'

const MainPage = () => {

  const { data: kardexTypes, isLoading, isError, error, isSuccess } = useGetTipoKardexList()

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