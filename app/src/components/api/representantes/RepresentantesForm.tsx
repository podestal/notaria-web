import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import { SedeRegistral } from "../../../services/api/sedesRegistralesService"
import { Contratante, RepresentanteContratanteData } from "../../../services/api/contratantesService"
import getTitleCase from "../../../utils/getTitleCase"
import { CreateRepresentanteData } from "../../../hooks/api/representante/useCreateRepresentante"
import { Representante } from "../../../services/api/representantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
    sedesRegistrales: SedeRegistral[]
    contratantes: Contratante[]
    kardex: string
    createRepresentante: UseMutationResult<Representante, Error, CreateRepresentanteData>
    setRepresentanteCreated: React.Dispatch<React.SetStateAction<boolean>>
    setContratanteRepresented: React.Dispatch<React.SetStateAction<string>>
    setOpenRepForm: React.Dispatch<React.SetStateAction<boolean>>
    onRepresentanteLinked?: (
        idcontratanterp: string,
        representanteData: RepresentanteContratanteData
    ) => void
    /** Contratante row being edited (the representante legal actor). */
    editingContratanteId?: string
}

const RepresentantesForm = ({
    sedesRegistrales,
    contratantes,
    kardex,
    createRepresentante,
    setRepresentanteCreated,
    setContratanteRepresented,
    setOpenRepForm,
    onRepresentanteLinked,
    editingContratanteId,
}: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [facultades, setFacultades] = useState('')
    const [subscribed, setSubscribed] = useState(1)
    const [sedeRegistral, setSedeRegistral] = useState(1)
    const [nPartida, setNPartida] = useState('')
    const access = useAuthStore((s) => s.access_token) || ''

    const [facultadesError, setFacultadesError] = useState('')
    const [sedeRegistralError, setSedeRegistralError] = useState('')
    const [nPartidaError, setNPartidaError] = useState('')

    const validateRepresentanteFields = (): boolean => {
        let valid = true

        if (!facultades.trim()) {
            setFacultadesError('Las facultades son obligatorias.')
            valid = false
        } else {
            setFacultadesError('')
        }

        if (!sedeRegistral || sedeRegistral <= 0) {
            setSedeRegistralError('La sede registral es obligatoria.')
            valid = false
        } else {
            setSedeRegistralError('')
        }

        if (!nPartida.trim()) {
            setNPartidaError('El número de partida es obligatorio.')
            valid = false
        } else {
            setNPartidaError('')
        }

        if (!valid) {
            setType('error')
            setMessage('Complete facultades, sede registral y número de partida.')
            setShow(true)
        }

        return valid
    }

    const handleSubmit = (contratante: Contratante) => {
        if (contratante === null) {
            setType("error")
            setMessage("Debe seleccionar un contratante")
            setShow(true)
            return
        }

        if (!validateRepresentanteFields()) {
            return
        }

        const representanteData: RepresentanteContratanteData = {
            facultades,
            inscrito: subscribed.toString(),
            idsedereg: sedeRegistral.toString(),
            numpartida: nPartida,
        }

        createRepresentante.mutate({
            access,
            representante: {
                facultades,
                inscrito: representanteData.inscrito,
                sede_registral: representanteData.idsedereg,
                partida: representanteData.numpartida,
                idtipoacto: null, 
                kardex: kardex,
                idcontratante: editingContratanteId ?? contratante.idcontratante,
                idcontratante_r: contratante.cliente_id,
                id_ro_repre: null,
                odb: null,
                ido: null
            }
        }, {
            onSuccess: () => {
                setType("success")
                setMessage("Representante creado correctamente")
                setShow(true)
                setOpenRepForm(false)
                if (onRepresentanteLinked) {
                    onRepresentanteLinked(contratante.idcontratante, representanteData)
                } else {
                    setRepresentanteCreated(true)
                    setContratanteRepresented(contratante.idcontratante)
                }
            }
            , onError: (error) => {
                setType("error")
                setMessage(`Error al crear el representante: ${error.message}`)
                setShow(true)
            }
        })
        // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos a una API
    }

  return (
        <div
            className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl text-center mb-6">Contratantes</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                <SimpleInput 
                    label="Facultades"
                    value={facultades}
                    setValue={setFacultades}
                    horizontal
                    error={facultadesError}
                    setError={setFacultadesError}
                    required
                />
                </div>
                <SimpleSelector 
                    label="Inscrito"
                    options={[
                        { label: 'Sí', value: 1 },
                        { label: 'No', value: 0 }
                    ]}
                    setter={setSubscribed}
                    defaultValue={subscribed}
                    
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <SimpleSelector 
                    label="Sede Registral"
                    options={sedesRegistrales.map(sede => ({
                        label: sede.dessede,
                        value: parseInt(sede.idsedereg, 10),
                    }))}
                    setter={setSedeRegistral}
                    defaultValue={sedeRegistral}
                    required
                    error={sedeRegistralError}
                    setError={setSedeRegistralError}
                />
                <SimpleInput 
                    label="Número de Partida"
                    value={nPartida}
                    setValue={setNPartida}
                    horizontal
                    required
                    error={nPartidaError}
                    setError={setNPartidaError}
                />
            </div>
            <div className="mt-6 flex flex-col gap-4">
                {/* <h3 className="text-sm">Contratantes Registrados</h3> */}
                {contratantes.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No hay contratantes registrados.</p>
                )}
                {contratantes.length > 0 && contratantes.map( contratante => (
                    <div
                        key={contratante.idcontratante}
                        className="grid grid-cols-3 gap-4 items-center hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
                    >
                        <p className="text-xs col-span-2">{getTitleCase(contratante.cliente)}</p>
                        <button 
                            onClick={() => {
                                // setSelectedContratante(contratante)
                                handleSubmit(contratante)
                            }}
                            type="button"
                            className="text-xs bg-blue-600 text-white w-[60%] py-1 rounded-2xl cursor-pointer hover:bg-blue-700">Seleccionar</button>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default RepresentantesForm