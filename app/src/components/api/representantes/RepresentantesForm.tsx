import { useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import { SedeRegistral } from "../../../services/api/sedesRegistralesService"
import { Contratante, RepresentanteContratanteData } from "../../../services/api/contratantesService"
import getTitleCase from "../../../utils/getTitleCase"
import { CreateRepresentanteData } from "../../../hooks/api/representante/useCreateRepresentante"
import { UpdateRepresentanteData } from "../../../hooks/api/representante/useUpdateRepresentante"
import { Representante } from "../../../services/api/representantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../store/useAuthStore"
import {
    parseInscritoValue,
    parseSedeRegistralValue,
    representanteToContratanteData,
    resolveLinkedRepresentanteContratanteId,
} from "../../../utils/representanteFormUtils"

interface Props {
    sedesRegistrales: SedeRegistral[]
    contratantes: Contratante[]
    kardex: string
    createRepresentante: UseMutationResult<Representante, Error, CreateRepresentanteData>
    updateRepresentante: UseMutationResult<Representante, Error, UpdateRepresentanteData>
    setRepresentanteCreated: React.Dispatch<React.SetStateAction<boolean>>
    setContratanteRepresented: React.Dispatch<React.SetStateAction<string>>
    setOpenRepForm: React.Dispatch<React.SetStateAction<boolean>>
    onRepresentanteLinked?: (
        idcontratanterp: string,
        representanteData: RepresentanteContratanteData
    ) => void
    /** Contratante row being edited (persona jurídica represented). */
    editingContratanteId?: string
    existingRepresentante?: Representante | null
    linkedRepresentanteContratanteId?: string
    initialRepresentanteData?: RepresentanteContratanteData
}

const RepresentantesForm = ({
    sedesRegistrales,
    contratantes,
    kardex,
    createRepresentante,
    updateRepresentante,
    setRepresentanteCreated,
    setContratanteRepresented,
    setOpenRepForm,
    onRepresentanteLinked,
    editingContratanteId,
    existingRepresentante,
    linkedRepresentanteContratanteId,
    initialRepresentanteData,
}: Props) => {

    const queryClient = useQueryClient()
    const { setMessage, setShow, setType } = useNotificationsStore()
    const access = useAuthStore((s) => s.access_token) || ""

    const [representanteRecordId, setRepresentanteRecordId] = useState<number | null>(null)
    const [facultades, setFacultades] = useState('')
    const [subscribed, setSubscribed] = useState(1)
    const [sedeRegistral, setSedeRegistral] = useState(0)
    const [nPartida, setNPartida] = useState('')

    const [facultadesError, setFacultadesError] = useState('')
    const [sedeRegistralError, setSedeRegistralError] = useState('')
    const [nPartidaError, setNPartidaError] = useState('')

    const resolvedLinkedId = useMemo(
        () =>
            resolveLinkedRepresentanteContratanteId(
                linkedRepresentanteContratanteId,
                existingRepresentante,
                contratantes
            ),
        [linkedRepresentanteContratanteId, existingRepresentante, contratantes]
    )

    useEffect(() => {
        if (existingRepresentante?.id) {
            setRepresentanteRecordId(existingRepresentante.id)
            setFacultades(existingRepresentante.facultades ?? '')
            setSubscribed(parseInscritoValue(existingRepresentante.inscrito))
            setSedeRegistral(parseSedeRegistralValue(existingRepresentante.sede_registral))
            setNPartida(existingRepresentante.partida ?? '')
            return
        }

        setRepresentanteRecordId(null)
        if (!initialRepresentanteData) return

        setFacultades(initialRepresentanteData.facultades ?? '')
        setSubscribed(parseInscritoValue(initialRepresentanteData.inscrito))
        setSedeRegistral(parseSedeRegistralValue(initialRepresentanteData.idsedereg))
        setNPartida(initialRepresentanteData.numpartida ?? '')
    }, [existingRepresentante, initialRepresentanteData])

    const isInscrito = subscribed === 1

    const handleSubscribedChange = (value: number) => {
        setSubscribed(value)
        if (value === 0) {
            setSedeRegistral(0)
            setNPartida('')
            setSedeRegistralError('')
            setNPartidaError('')
        }
    }

    const validateRepresentanteFields = (): boolean => {
        setFacultadesError('')
        setSedeRegistralError('')
        setNPartidaError('')
        return true
    }

    const finishSuccess = (
        contratante: Contratante,
        representanteData: RepresentanteContratanteData,
        isUpdate: boolean
    ) => {
        setType('success')
        setMessage(
            isUpdate
                ? 'Representante actualizado correctamente'
                : 'Representante creado correctamente'
        )
        setShow(true)
        setOpenRepForm(false)

        if (editingContratanteId) {
            queryClient.invalidateQueries({
                queryKey: ['representante', 'by_contratante', editingContratanteId],
            })
        }

        if (onRepresentanteLinked) {
            onRepresentanteLinked(contratante.idcontratante, representanteData)
        } else {
            setRepresentanteCreated(true)
            setContratanteRepresented(contratante.idcontratante)
        }
    }

    const handleSubmit = (contratante: Contratante) => {
        if (!validateRepresentanteFields()) {
            return
        }

        const sedeValue = isInscrito ? sedeRegistral.toString() : ''
        const partidaValue = isInscrito ? nPartida : ''

        const representanteData: RepresentanteContratanteData = {
            facultades,
            inscrito: subscribed.toString(),
            idsedereg: sedeValue,
            numpartida: partidaValue,
        }

        const payload = {
            facultades,
            inscrito: representanteData.inscrito,
            sede_registral: sedeValue,
            partida: partidaValue,
            idtipoacto: null,
            kardex,
            idcontratante: editingContratanteId ?? contratante.idcontratante,
            idcontratante_r: contratante.cliente_id,
            id_ro_repre: null,
            odb: null,
            ido: null,
        }

        const onError = (error: Error) => {
            setType('error')
            setMessage(`Error al guardar el representante: ${error.message}`)
            setShow(true)
        }

        if (representanteRecordId) {
            updateRepresentante.mutate(
                {
                    access,
                    representanteId: representanteRecordId,
                    representante: payload,
                },
                {
                    onSuccess: () => finishSuccess(contratante, representanteData, true),
                    onError,
                }
            )
            return
        }

        createRepresentante.mutate(
            { access, representante: payload },
            {
                onSuccess: (saved) => {
                    if (saved?.id) setRepresentanteRecordId(saved.id)
                    finishSuccess(contratante, representanteData, false)
                },
                onError,
            }
        )
    }

    const isSaving = createRepresentante.isPending || updateRepresentante.isPending

  return (
        <div className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl text-center mb-2">Representante</h2>
            {existingRepresentante?.id && (
                <p className="text-xs text-center text-slate-600 mb-2">
                    Datos cargados del registro de representantes. Puede actualizar y cambiar la persona.
                </p>
            )}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                <SimpleInput 
                    label="Facultades"
                    value={facultades}
                    setValue={setFacultades}
                    horizontal
                    error={facultadesError}
                    setError={setFacultadesError}
                />
                </div>
                <SimpleSelector 
                    label="Inscrito"
                    options={[
                        { label: 'Sí', value: 1 },
                        { label: 'No', value: 0 }
                    ]}
                    setter={handleSubscribedChange}
                    defaultValue={subscribed}
                />
            </div>
            {isInscrito && (
            <div className="grid grid-cols-2 gap-4">
                <SimpleSelector 
                    label="Sede Registral"
                    options={sedesRegistrales.map(sede => ({
                        label: sede.dessede,
                        value: parseInt(sede.idsedereg, 10),
                    }))}
                    setter={setSedeRegistral}
                    defaultValue={sedeRegistral}
                    error={sedeRegistralError}
                    setError={setSedeRegistralError}
                />
                <SimpleInput 
                    label="Número de Partida"
                    value={nPartida}
                    setValue={setNPartida}
                    horizontal
                    error={nPartidaError}
                    setError={setNPartidaError}
                />
            </div>
            )}
            <div className="mt-6 flex flex-col gap-4">
                {contratantes.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No hay contratantes registrados.</p>
                )}
                {contratantes
                    .filter((c) => c.idcontratante !== editingContratanteId)
                    .map((contratante) => {
                    const isLinked = contratante.idcontratante === resolvedLinkedId
                    return (
                    <div
                        key={contratante.idcontratante}
                        className={`grid grid-cols-3 gap-4 items-center p-2 rounded-md transition-colors duration-200 ${
                            isLinked
                                ? 'bg-blue-50 border border-blue-300'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        <p className="text-xs col-span-2">
                            {getTitleCase(contratante.cliente)}
                            {isLinked && (
                                <span className="ml-2 text-blue-700 font-semibold">(actual)</span>
                            )}
                        </p>
                        <button 
                            onClick={() => handleSubmit(contratante)}
                            type="button"
                            disabled={isSaving}
                            className="text-xs bg-blue-600 text-white w-[60%] py-1 rounded-2xl cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSaving
                                ? 'Guardando...'
                                : isLinked && representanteRecordId
                                    ? 'Actualizar'
                                    : 'Seleccionar'}
                        </button>
                    </div>
                )})}
            </div>
        </div>
  )
}

export default RepresentantesForm
