import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import DateInput from "../../ui/DateInput"
import VehicleLooker from "./VehicleLooker"
import {
    formatFecInscForApi,
    formatThreeDigitIntForApi,
    isValidFecInsc,
    parseFecInscForDisplay,
    parseThreeDigitIntForDisplay,
    sanitizeThreeDigitIntInput,
} from "./vehicleFormShared"
import { CreateVehicularData } from "../../../hooks/api/vehiculares/useCreateVehicular"
import { Vehicle } from "../../../services/api/vehicleService"
import { UseMutationResult } from "@tanstack/react-query"
import useAuthStore from "../../../store/useAuthStore"
import { VEHICLE_SEARCH_TYPES } from "../../../data/patrimonialData" 
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useGetSedesRegistrales from "../../../hooks/api/sedesRegistrales/useGetSedesRegistrales"
import { UpdateVehicleData } from "../../../hooks/api/vehiculares/useUpdateVehicular"
import {
    FOUR_DIGIT_YEAR_ERROR,
    isValidFourDigitYearOrEmpty,
    sanitizeFourDigitYearInput,
} from "../../../utils/fourDigitYear"
import useGetPendingDocumentosVehiculares from "../../../hooks/documentos/useGetPendingDocumentosVehiculares"
import useApplyDocumentoVehicular from "../../../hooks/documentos/useApplyDocumentoVehicular"
import type { DocumentoBien } from "../../../services/documentos/documentosVehicularesService"

interface Props {
    createVehicle?: UseMutationResult<Vehicle, Error, CreateVehicularData>
    updateVehicular?: UseMutationResult<Vehicle, Error, UpdateVehicleData>
    kardex: string
    idtipoacto: string
    vehicle?: Vehicle
}

type ParsedVehiculo = {
    placa?: string
    marca?: string
    modelo?: string
    carroceria?: string
    color_1?: string
    numero_motor?: string
    numero_serie?: string
    anio_fabricacion?: string
    combustible?: string
    numero_cilindros?: string
    numero_ruedas?: string
    fecha_inscripcion?: string
    partida?: string
    categoria?: string
    tipo_uso?: string
    oficina?: string
}

type ParsedPropietario = {
    nombre?: string
    dni?: string
    direccion?: string
}

type BoletaPropietarioInfo = {
    nombre: string
    dni: string
    direccion: string
}

const emptyPropietarioInfo = (): BoletaPropietarioInfo => ({
    nombre: "",
    dni: "",
    direccion: "",
})

const resolveClase = (veh: ParsedVehiculo) =>
    (veh.categoria || "").trim() || (veh.tipo_uso || "").trim()

const hasPropietarioInfo = (info: BoletaPropietarioInfo) =>
    Boolean(info.nombre || info.dni || info.direccion)

const VehicleForm = ({ createVehicle, updateVehicular, kardex, idtipoacto, vehicle }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [loading, setLoading] = useState(false)
    const isCreate = Boolean(createVehicle) && !vehicle
    const {
        data: pendingDocs = [],
        isLoading: pendingLoading,
        isError: pendingError,
        error: pendingErr,
        refetch: refetchPending,
    } = useGetPendingDocumentosVehiculares(isCreate)
    const applyDocumento = useApplyDocumentoVehicular()
    const { data: sedes, isLoading, isError, error, isSuccess } = useGetSedesRegistrales({ access })
    const [selectedDocumentoId, setSelectedDocumentoId] = useState("")
    const [propietarioInfo, setPropietarioInfo] = useState<BoletaPropietarioInfo>(emptyPropietarioInfo)
    
    const [plateId, setPlateId] = useState(vehicle ? vehicle.idplaca : 'P'); 
    const [plate, setPlate] = useState( vehicle ? vehicle.numplaca : ''); 
    const [carroceria, setCarroceria] = useState( vehicle ? vehicle.carroceria : '');
    const [color, setColor] = useState( vehicle ? vehicle.color : '');
    const [clase, setClase] = useState( vehicle ? vehicle.clase : '');
    const [motor, setMotor] = useState( vehicle ? vehicle.motor : '');
    const [marca, setMarca] = useState( vehicle ? vehicle.marca : '');
    const [cilindros, setCilindros] = useState(() => parseThreeDigitIntForDisplay(vehicle?.numcil));
    const [anioFabricacion, setAnioFabricacion] = useState( vehicle ? vehicle.anofab : '');
    const [numeroSerie, setNumeroSerie] = useState( vehicle ? vehicle.numserie : '');
    const [modelo, setModelo] = useState(vehicle ? vehicle.modelo : '');
    const [ruedas, setRuedas] = useState(() => parseThreeDigitIntForDisplay(vehicle?.numrueda));
    const [combustible, setCombustible] = useState( vehicle ? vehicle.combustible : '');
    const [fechaInscripcion, setFechaInscripcion] = useState(() => parseFecInscForDisplay(vehicle?.fecinsc));
    const [partidaRegistral, setPartidaRegistral] = useState( vehicle ? vehicle.pregistral : '');
    const [selectedSedesRegistral, setSelectedSedesRegistral] = useState(vehicle ? vehicle.idsedereg : '0'); 

    // ERROR HANDLING
    const [plateError, setPlateError] = useState('')
    const [motorError, setMotorError] = useState('')
    const [fechaInscripcionError, setFechaInscripcionError] = useState('')
    const [anioFabricacionError, setAnioFabricacionError] = useState('')

    const setCilindrosSafe = (value: string) => setCilindros(sanitizeThreeDigitIntInput(value))
    const setRuedasSafe = (value: string) => setRuedas(sanitizeThreeDigitIntInput(value))

    const applyPendingDocumento = (doc: DocumentoBien) => {
        const parsed = doc.parsed as
            | {
                  vehiculo?: ParsedVehiculo
                  propietario?: ParsedPropietario
                  meta?: { oficina?: string }
              }
            | undefined
        const veh = parsed?.vehiculo ?? {}
        const prop = parsed?.propietario ?? {}
        const oficina = (veh.oficina || parsed?.meta?.oficina || doc.oficina || "").trim()
        setSelectedDocumentoId(String(doc.id))
        setPropietarioInfo({
            nombre: (prop.nombre || "").trim(),
            dni: (prop.dni || "").trim(),
            direccion: (prop.direccion || "").trim(),
        })
        setPlateId("P")
        setPlate(veh.placa || doc.placa || "")
        setCarroceria(veh.carroceria || "")
        setColor(veh.color_1 || "")
        setClase(resolveClase(veh))
        setMotor(veh.numero_motor || "")
        setMarca(veh.marca || "")
        setCilindros(parseThreeDigitIntForDisplay(veh.numero_cilindros))
        setAnioFabricacion(veh.anio_fabricacion || "")
        setNumeroSerie(veh.numero_serie || "")
        setModelo(veh.modelo || "")
        setRuedas(parseThreeDigitIntForDisplay(veh.numero_ruedas))
        setCombustible(veh.combustible || "")
        setFechaInscripcion(parseFecInscForDisplay(veh.fecha_inscripcion))
        setPartidaRegistral(veh.partida || doc.partida || "")
        if (oficina && sedes?.length) {
            const needle = oficina.toUpperCase()
            const match = sedes.find((sede) =>
                (sede.dessede || "").toUpperCase().includes(needle),
            )
            if (match) setSelectedSedesRegistral(match.idsedereg)
        }
        setPlateError("")
        setMotorError("")
        setFechaInscripcionError("")
        setAnioFabricacionError("")
    }

    const resetCreateForm = () => {
        setSelectedDocumentoId("")
        setPropietarioInfo(emptyPropietarioInfo())
        setPlateId('P')
        setPlate('')
        setCarroceria('')
        setColor('')
        setClase('')
        setMotor('')
        setMarca('')
        setCilindros('')
        setAnioFabricacion('')
        setNumeroSerie('')
        setModelo('')
        setRuedas('')
        setCombustible('')
        setFechaInscripcion('')
        setPartidaRegistral('')
        setSelectedSedesRegistral('0')
    }

    const buildVehiclePayload = () => ({
        kardex,
        idtipacto: idtipoacto,
        idplaca: plateId,
        numplaca: plate,
        clase,
        marca,
        anofab: anioFabricacion,
        modelo,
        combustible,
        carroceria,
        fecinsc: formatFecInscForApi(fechaInscripcion),
        color,
        motor,
        numcil: formatThreeDigitIntForApi(cilindros),
        numserie: numeroSerie,
        numrueda: formatThreeDigitIntForApi(ruedas),
        idmon: "1",
        precio: "0",
        codmepag: "1",
        pregistral: partidaRegistral,
        idsedereg: selectedSedesRegistral,
    })

    const linkPendingDocumento = (detveh: number, onDone: () => void) => {
        const documentoId = Number(selectedDocumentoId)
        if (!documentoId) {
            onDone()
            return
        }
        applyDocumento.mutate(
            {
                documento_id: documentoId,
                kardex,
                idtipacto: idtipoacto,
                replace_existing: true,
                overwrite_detalle: false,
                detveh,
            },
            {
                onSettled: onDone,
            },
        )
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        // Validate required fields
        if (!plate) {
            setPlateError('El campo Placa es obligatorio')
            return
        }

        if (!motor) {
            setMotorError('El campo Motor es obligatorio')
            return
        }

        if (!isValidFourDigitYearOrEmpty(anioFabricacion)) {
            setAnioFabricacionError(FOUR_DIGIT_YEAR_ERROR)
            return
        }
        setAnioFabricacionError('')

        if (!isValidFecInsc(fechaInscripcion)) {
            setFechaInscripcionError('Use el formato DD/MM/YYYY')
            return
        }
        setFechaInscripcionError('')

        setLoading(true)

        createVehicle && createVehicle.mutate({
            vehicle: buildVehiclePayload(),
            access,
        }, {
            onSuccess: (created) => {
                linkPendingDocumento(created.detveh, () => {
                    setMessage('Vehículo creado correctamente')
                    setShow(true)
                    setType('success')
                    resetCreateForm()
                    setLoading(false)
                })
            },
            onError: (error) => {
                console.error("Error creating vehicle:", error);
                setMessage('Error al crear el vehículo')
                setShow(true)
                setType('error')
                setLoading(false)
            },
        })

        updateVehicular && updateVehicular.mutate({
            access,
            vehicle: buildVehiclePayload(),
        }, {
            onSuccess: () => {
                setMessage('Vehículo actualizado correctamente')
                setShow(true)
                setType('success')
            },
            onError: (error) => {
                console.error("Error updating vehicle:", error);
                setMessage('Error al actualizar el vehículo')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })
    }

    if (isLoading) return <p className="text-md animate-pulse text-center my-2">Cargando sedes registrales...</p>
    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess)

  return (
    <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
        {isCreate && (
            <div className="rounded-lg border border-sky-200 bg-sky-50/80 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                    Boletas pendientes (SUNARP)
                </p>
                {pendingLoading ? (
                    <p className="text-xs text-slate-500">Cargando pendientes…</p>
                ) : pendingError ? (
                    <div className="space-y-1">
                        <p className="text-xs text-rose-600">
                            No se pudieron cargar las boletas pendientes
                            {pendingErr?.message ? `: ${pendingErr.message}` : "."}
                        </p>
                        <button
                            type="button"
                            className="text-[11px] font-semibold text-sky-700 hover:underline"
                            onClick={() => void refetchPending()}
                        >
                            Reintentar
                        </button>
                    </div>
                ) : pendingDocs.length === 0 ? (
                    <p className="text-xs text-slate-500">
                        No hay boletas vehiculares pendientes. Súbelas en Documentos → Vehiculares.
                    </p>
                ) : (
                    <div className="space-y-3">
                        <label className="flex flex-col gap-1 text-xs text-slate-700">
                            <span>Usar boleta parseada</span>
                            <select
                                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                                value={selectedDocumentoId}
                                onChange={(e) => {
                                    const id = e.target.value
                                    if (!id) {
                                        setSelectedDocumentoId("")
                                        setPropietarioInfo(emptyPropietarioInfo())
                                        return
                                    }
                                    const doc = pendingDocs.find((item) => String(item.id) === id)
                                    if (doc) applyPendingDocumento(doc)
                                }}
                            >
                                <option value="">Selecciona una boleta…</option>
                                {pendingDocs.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {(doc.placa || "Sin placa") +
                                            (doc.partida ? ` · partida ${doc.partida}` : "") +
                                            ` · #${doc.id}`}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {selectedDocumentoId && hasPropietarioInfo(propietarioInfo) && (
                            <div className="rounded-md border border-sky-100 bg-white/80 p-3">
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                                    Datos del propietario (SUNARP)
                                </p>
                                <dl className="grid gap-2 text-xs sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <dt className="text-slate-500">Nombre</dt>
                                        <dd className="font-semibold text-slate-900">
                                            {propietarioInfo.nombre || "—"}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500">DNI</dt>
                                        <dd className="font-semibold text-slate-900">
                                            {propietarioInfo.dni || "—"}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-slate-500">Dirección</dt>
                                        <dd className="font-semibold text-slate-900">
                                            {propietarioInfo.direccion || "—"}
                                        </dd>
                                    </div>
                                </dl>
                                <p className="mt-2 text-[11px] text-slate-500">
                                    Solo referencia de la boleta — no se guarda en detalle vehicular.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
        <div className="grid grid-cols-2 gap-4 items-center">
            <SimpleSelectorStr 
                options={VEHICLE_SEARCH_TYPES.map(type => ({
                    value: type.idPlaca,
                    label: type.descripcion
                }))}
                defaultValue={plateId}
                setter={setPlateId}
                label="Tipo de vehiculo"
                required
            />
            <SimpleInput 
                value={carroceria}
                setValue={setCarroceria}
                label="Carrocería"
                horizontal
            />
        </div>
        <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 flex items-center gap-6">
            <SimpleInput 
                value={plate}
                setValue={setPlate}
                label="N Placa/Poliza"
                horizontal
                required
                error={plateError}
                setError={setPlateError}
            />
            {plateId === 'P' && 
            <VehicleLooker 
                plate={plate}
                setColor={setColor}
                setMarca={setMarca}
                setModelo={setModelo}
                setSerie={setNumeroSerie}
                setCarroceria={setCarroceria}
                setMotor={setMotor}
                setCilindros={setCilindrosSafe}
                setAnioFabricacion={setAnioFabricacion}
                setRuedas={setRuedasSafe}
                setCombustible={setCombustible}
                setFechaInscripcion={setFechaInscripcion}
                setPartidaRegistral={setPartidaRegistral}
                setClase={setClase}
                setSelectedSedesRegistral={setSelectedSedesRegistral}
            />}
            </div>
            <div  className="col-span-2 flex items-center gap-6">
                <SimpleInput 
                    value={color}
                    setValue={setColor}
                    label="Color"
                    horizontal
                />
            </div>
    

        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={clase}
                setValue={setClase}
                label="Clase"
                horizontal
            />
            <SimpleInput 
                value={motor}
                setValue={setMotor}
                label="Motor"
                horizontal
                required
                error={motorError}
                setError={setMotorError}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={marca}
                setValue={setMarca}
                label="Marca"
                horizontal
            />
            <SimpleInput
                value={cilindros}
                setValue={setCilindrosSafe}
                label="Cilindros"
                horizontal
                type="text"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={anioFabricacion}
                setValue={(value) => {
                    setAnioFabricacionError('')
                    setAnioFabricacion(sanitizeFourDigitYearInput(value))
                }}
                label="Año fabricación"
                horizontal
                error={anioFabricacionError}
                setError={setAnioFabricacionError}
            />
            <SimpleInput 
                value={numeroSerie}
                setValue={setNumeroSerie}
                label="Numero de serie"
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={modelo}
                setValue={setModelo}
                label="Modelo"
                horizontal
            />
            <SimpleInput
                value={ruedas}
                setValue={setRuedasSafe}
                label="Ruedas"
                horizontal
                type="text"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={combustible}
                setValue={setCombustible}
                label="Combustible"
                horizontal
            />
            <DateInput
                value={fechaInscripcion}
                setValue={setFechaInscripcion}
                setError={setFechaInscripcionError}
                error={fechaInscripcionError}
                label="Fecha de inscripción"
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={partidaRegistral}
                setValue={setPartidaRegistral}
                label="Partida Registral"
                horizontal
            />
            <SimpleSelectorStr 
                options={[{value: '0', label: 'Selecciona'}, ...sedes.map(sede => ({
                    value: sede.idsedereg,
                    label: sede.dessede
                }))]}
                defaultValue={selectedSedesRegistral}
                setter={setSelectedSedesRegistral}
                label="Sede Registral"
            />
        </div>
        <div className="w-full flex justify-items-center items-center my-4 text-center">
            <button className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer ${loading && 'animate-pulse'}`} type="submit">
                {loading ? 'Cargando ...' : 'Guardar'}
            </button>
        </div>
    </form>
  )
}

export default VehicleForm