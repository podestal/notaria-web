import KardexForm from "../../kardex/KardexForm"
import useRetrieveKardex from "../../../../hooks/api/kardex/useRetrieveKardex"

interface Props {
    isOpen: boolean
    kardexId: number
}

const PreKardexForm = ({
    isOpen,
    kardexId
}: Props) => {

    const { data: kardex, isLoading, isError, error, isSuccess } = useRetrieveKardex({ id: kardexId, enabled: isOpen })

    if (isLoading) return <div>Cargando...</div>
    if (isError) return <div>Error al cargar el kardex {error?.message}</div>
    if (isSuccess) return (
      <div>
        <KardexForm 
          kardex={kardex}
        />
      </div>
    )
}

export default PreKardexForm