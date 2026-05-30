import { RepresentanteContratanteData } from "../../../services/api/contratantesService"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import useCreateRepresentante from "../../../hooks/api/representante/useCreateRepresentante"
import useGetRepresentanteByContratante from "../../../hooks/api/representante/useGetRepresentanteByContratante"
import useUpdateRepresentante from "../../../hooks/api/representante/useUpdateRepresentante"
import useGetSedesRegistrales from "../../../hooks/api/sedesRegistrales/useGetSedesRegistrales"
import useAuthStore from "../../../store/useAuthStore"
import RepresentantesForm from "./RepresentantesForm"

interface Props {
    kardex: string
    setRepresentanteCreated: React.Dispatch<React.SetStateAction<boolean>>
    setContratanteRepresented: React.Dispatch<React.SetStateAction<string>>
    setOpenRepForm: React.Dispatch<React.SetStateAction<boolean>>
    onRepresentanteLinked?: (
        idcontratanterp: string,
        representanteData: RepresentanteContratanteData
    ) => void
    editingContratanteId?: string
    linkedRepresentanteContratanteId?: string
    initialRepresentanteData?: RepresentanteContratanteData
}

const CreateRepresentante = ({
    kardex,
    setRepresentanteCreated,
    setContratanteRepresented,
    setOpenRepForm,
    onRepresentanteLinked,
    editingContratanteId,
    linkedRepresentanteContratanteId,
    initialRepresentanteData,
}: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const createRepresentante = useCreateRepresentante()
    const updateRepresentante = useUpdateRepresentante()
    const { data: sedesRegistrales, isLoading: isLoadingSedes, isError: isErrorSedes, isSuccess: isSuccessSedes } = useGetSedesRegistrales({ access })
    const { data: contratantes, isLoading: isLoadingContratantes, isError: isErrorContratantes, isSuccess: isSuccessContratantes } = useGetContratantesByKardex({ kardex })
    const {
        data: existingRepresentante,
        isLoading: isLoadingRepresentante,
        isError: isErrorRepresentante,
    } = useGetRepresentanteByContratante({
        idcontratante: editingContratanteId ?? '',
        kardex,
        enabled: !!editingContratanteId,
    })

    const isLoading =
        isLoadingSedes ||
        isLoadingContratantes ||
        (!!editingContratanteId && isLoadingRepresentante)

    if (isLoading) return <p className="text-md animate-pulse text-center">Cargando ...</p>

    if (isErrorSedes || isErrorContratantes || isErrorRepresentante) {
        return <p className="text-md text-red-500 text-center">Error</p>
    }

    if (!isSuccessSedes || !isSuccessContratantes) return null

  return (
    <div>
        <RepresentantesForm 
            sedesRegistrales={sedesRegistrales}
            contratantes={contratantes}
            kardex={kardex}
            createRepresentante={createRepresentante}
            updateRepresentante={updateRepresentante}
            setRepresentanteCreated={setRepresentanteCreated}
            setContratanteRepresented={setContratanteRepresented}
            setOpenRepForm={setOpenRepForm}
            onRepresentanteLinked={onRepresentanteLinked}
            editingContratanteId={editingContratanteId}
            existingRepresentante={existingRepresentante}
            linkedRepresentanteContratanteId={linkedRepresentanteContratanteId}
            initialRepresentanteData={initialRepresentanteData}
        />
    </div>
  )
}

export default CreateRepresentante