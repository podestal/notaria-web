import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import useGetSedesRegistrales from "../../../hooks/api/sedesRegistrales/useGetSedesRegistrales"
import useAuthStore from "../../../store/useAuthStore"
import RepresentantesForm from "./RepresentantesForm"

interface Props {
    kardex: string
}

const CreateRepresentante = ({ kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: sedesRegistrales, isLoading: isLoadingSedes, isError: isErrorSedes, isSuccess: isSuccessSedes } = useGetSedesRegistrales({ access })
    const { data: contratantes, isLoading: isLoadingContratantes, isError: isErrorContratantes, isSuccess: isSuccessContratantes } = useGetContratantesByKardex({ kardex })

    if (isLoadingSedes || isLoadingContratantes) return <p className="text-md animate-pulse text-center">Cargando ...</p>

    if (isErrorSedes || isErrorContratantes) return <p className="text-md text-red-500 text-center">Error</p>
    if (isSuccessSedes && isSuccessContratantes) 

  return (
    <div>
        <RepresentantesForm 
            sedesRegistrales={sedesRegistrales}
            contratantes={contratantes}
        />
    </div>
  )
}

export default CreateRepresentante