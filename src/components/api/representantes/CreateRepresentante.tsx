import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import useCreateRepresentante from "../../../hooks/api/representante/useCreateRepresentante"
import useGetSedesRegistrales from "../../../hooks/api/sedesRegistrales/useGetSedesRegistrales"
import useAuthStore from "../../../store/useAuthStore"
import RepresentantesForm from "./RepresentantesForm"

interface Props {
    kardex: string
    setRepresentanteCreated: React.Dispatch<React.SetStateAction<boolean>>
    setContratanteRepresented: React.Dispatch<React.SetStateAction<string>>
}

const CreateRepresentante = ({ kardex, setRepresentanteCreated, setContratanteRepresented }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const createRepresentante = useCreateRepresentante()
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
            kardex={kardex}
            createRepresentante={createRepresentante}
            setRepresentanteCreated={setRepresentanteCreated}
            setContratanteRepresented={setContratanteRepresented}
        />
    </div>
  )
}

export default CreateRepresentante