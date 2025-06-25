import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import VehicleLooker from "./VehicleLooker"
import { CreateVehicularData } from "../../../hooks/api/vehiculares/useCreateVehicular"
import { Vehicle } from "../../../services/api/vehicleService"
import { UseMutationResult } from "@tanstack/react-query"
import useAuthStore from "../../../store/useAuthStore"
import { VEHICLE_SEARCH_TYPES } from "../../../data/patrimonialData" 
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
    createVehicle?: UseMutationResult<Vehicle, Error, CreateVehicularData>
    kardex: string
    idtipoacto: string
}


const VehicleForm = ({ createVehicle, kardex, idtipoacto }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [loading, setLoading] = useState(false)
    
    const [plateId, setPlateId] = useState('P'); // Default value for plate type
    const [plate, setPlate] = useState('');
    const [carroceria, setCarroceria] = useState('');
    const [color, setColor] = useState('');
    const [clase, setClase] = useState('');
    const [motor, setMotor] = useState('');
    const [marca, setMarca] = useState('');
    const [cilindros, setCilindros] = useState('');
    const [anioFabricacion, setAnioFabricacion] = useState('');
    const [numeroSerie, setNumeroSerie] = useState('');
    const [modelo, setModelo] = useState('');
    const [ruedas, setRuedas] = useState('');
    const [combustible, setCombustible] = useState('');
    const [fechaInscripcion, setFechaInscripcion] = useState('');
    const [partidaRegistral, setPartidaRegistral] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
                idsedereg: '1', // Assuming a default value for registry office
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
    }


  return (
    <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
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
                required
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
            />}
            </div>
            <div  className="col-span-2 flex items-center gap-6">
                <SimpleInput 
                    value={color}
                    setValue={setColor}
                    label="Color"
                    horizontal
                    required
                />
            </div>
    

        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={clase}
                setValue={setClase}
                label="Clase"
                horizontal
                required
            />
            <SimpleInput 
                value={motor}
                setValue={setMotor}
                label="Motor"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={marca}
                setValue={setMarca}
                label="Marca"
                horizontal
                required
            />
            <SimpleInput 
                value={cilindros}
                setValue={setCilindros}
                label="Cilindros"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={anioFabricacion}
                setValue={setAnioFabricacion}
                label="Año fabricación"
                horizontal
                required
            />
            <SimpleInput 
                value={numeroSerie}
                setValue={setNumeroSerie}
                label="Numero de serie"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={modelo}
                setValue={setModelo}
                label="Modelo"
                horizontal
                required
            />
            <SimpleInput 
                value={ruedas}
                setValue={setRuedas}
                label="Ruedas"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={combustible}
                setValue={setCombustible}
                label="Combustible"
                horizontal
                required
            />
            <SimpleInput 
                value={fechaInscripcion}
                setValue={setFechaInscripcion}
                label="Fecha de inscripción"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={partidaRegistral}
                setValue={setPartidaRegistral}
                label="Partida Registral"
                horizontal
                required
            />
            <SimpleSelector
                options={[
                    {value: 1, label: 'Seleccionar'},
                    {value: 2, label: 'Inactivo'},
                ]}
                defaultValue={1}
                setter={() => {}}
                label="Sede Registral"
                required
            />
        </div>
        <div className="w-full flex justify-items-center items-center my-4 text-center">
            <button className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer ${loading && 'animate-pulse'}`} type="submit">
                {loading ? 'Creando ...' : 'Guardar Vehículo'}
            </button>
        </div>
    </form>
  )
}

export default VehicleForm