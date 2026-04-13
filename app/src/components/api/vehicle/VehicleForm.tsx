import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import VehicleLooker from "./VehicleLooker"
import { CreateVehicularData } from "../../../hooks/api/vehiculares/useCreateVehicular"
import { Vehicle } from "../../../services/api/vehicleService"
import { UseMutationResult } from "@tanstack/react-query"
import useAuthStore from "../../../store/useAuthStore"
import { VEHICLE_SEARCH_TYPES } from "../../../data/patrimonialData" 
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useGetSedesRegistrales from "../../../hooks/api/sedesRegistrales/useGetSedesRegistrales"
import { UpdateVehicleData } from "../../../hooks/api/vehiculares/useUpdateVehicular"

interface Props {
    createVehicle?: UseMutationResult<Vehicle, Error, CreateVehicularData>
    updateVehicular?: UseMutationResult<Vehicle, Error, UpdateVehicleData>
    kardex: string
    idtipoacto: string
    vehicle?: Vehicle
}


const VehicleForm = ({ createVehicle, updateVehicular, kardex, idtipoacto, vehicle }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [loading, setLoading] = useState(false)
    
    const [plateId, setPlateId] = useState(vehicle ? vehicle.idplaca : 'P'); 
    const [plate, setPlate] = useState( vehicle ? vehicle.numplaca : ''); 
    const [carroceria, setCarroceria] = useState( vehicle ? vehicle.carroceria : '');
    const [color, setColor] = useState( vehicle ? vehicle.color : '');
    const [clase, setClase] = useState( vehicle ? vehicle.clase : '');
    const [motor, setMotor] = useState( vehicle ? vehicle.motor : '');
    const [marca, setMarca] = useState( vehicle ? vehicle.marca : '');
    const [cilindros, setCilindros] = useState(vehicle ? vehicle.numcil : '');
    const [anioFabricacion, setAnioFabricacion] = useState( vehicle ? vehicle.anofab : '');
    const [numeroSerie, setNumeroSerie] = useState( vehicle ? vehicle.numserie : '');
    const [modelo, setModelo] = useState(vehicle ? vehicle.modelo : '');
    const [ruedas, setRuedas] = useState(vehicle ? vehicle.numrueda : '');
    const [combustible, setCombustible] = useState( vehicle ? vehicle.combustible : '');
    const [fechaInscripcion, setFechaInscripcion] = useState( vehicle ? vehicle.fecinsc : '');
    const [partidaRegistral, setPartidaRegistral] = useState( vehicle ? vehicle.pregistral : '');
    const [selectedSedesRegistral, setSelectedSedesRegistral] = useState(vehicle ? vehicle.idsedereg : '0'); 

    // ERROR HANDLING
    const [plateError, setPlateError] = useState('')
    const [motorError, setMotorError] = useState('')


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

        setLoading(true)

        createVehicle && createVehicle.mutate({
            vehicle: {
                kardex, // This should be set based on your application logic
                idtipacto: idtipoacto, // Default value for type, adjust as needed
                idplaca: plateId,
                numplaca: plate,
                clase,
                marca,
                anofab: anioFabricacion,
                modelo,
                combustible,
                carroceria,
                fecinsc: fechaInscripcion,
                color,
                motor,
                numcil: cilindros,
                numserie: numeroSerie,
                numrueda: ruedas,
                idmon: '1', // Assuming a default value for currency
                precio: '0', // Assuming a default value for price
                codmepag: '1', // Assuming a default value for payment method
                pregistral: partidaRegistral, 
                idsedereg: selectedSedesRegistral, // Assuming a default value for registry office
            },
            access 
        }, {
            onSuccess: () => {
                setMessage('Vehículo creado correctamente')
                setShow(true)
                setType('success')
                // Reset form fields after successful submission
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
            },
            onError: (error) => {
                console.error("Error creating vehicle:", error);
                setMessage('Error al crear el vehículo')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })

        updateVehicular && updateVehicular.mutate({
            access,
            vehicle: {
                kardex, // This should be set based on your application logic
                idtipacto: idtipoacto, // Default value for type, adjust as needed
                idplaca: plateId,
                numplaca: plate,
                clase,
                marca,
                anofab: anioFabricacion,
                modelo,
                combustible,
                carroceria,
                fecinsc: fechaInscripcion,
                color,
                motor,
                numcil: cilindros,
                numserie: numeroSerie,
                numrueda: ruedas,
                idmon: '1', // Assuming a default value for currency
                precio: '0', // Assuming a default value for price
                codmepag: '1', // Assuming a default value for payment method
                pregistral: partidaRegistral, 
                idsedereg: selectedSedesRegistral, // Assuming a default value for registry office
            }
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

    const { data: sedes, isLoading, isError, error, isSuccess } = useGetSedesRegistrales({ access })

    if (isLoading) return <p className="text-md animate-pulse text-center my-2">Cargando sedes registrales...</p>
    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess)

  return (
    <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
        <div className="grid grid-cols-2 gap-4 items-center">
        <>{console.log('vehicle', vehicle)}</>
            <>{console.log('selectedSedesRegistral', selectedSedesRegistral)}</>
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
                setCilindros={setCilindros}
                setAnioFabricacion={setAnioFabricacion}
                setRuedas={setRuedas}
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
                setValue={setCilindros}
                label="Cilindros"
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={anioFabricacion}
                setValue={setAnioFabricacion}
                label="Año fabricación"
                horizontal
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
                setValue={setRuedas}
                label="Ruedas"
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={combustible}
                setValue={setCombustible}
                label="Combustible"
                horizontal
            />
            <SimpleInput 
                value={fechaInscripcion}
                setValue={setFechaInscripcion}
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