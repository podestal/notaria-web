import axios from "axios"
import { useState } from "react";
import useAuthStore from "../../../store/useAuthStore";

interface Props {
    plate: string
    setColor: React.Dispatch<React.SetStateAction<string>>
    setMarca: React.Dispatch<React.SetStateAction<string>>
    setModelo: React.Dispatch<React.SetStateAction<string>>
    setSerie: React.Dispatch<React.SetStateAction<string>>
    setCarroceria: React.Dispatch<React.SetStateAction<string>>
    setMotor: React.Dispatch<React.SetStateAction<string>>
    setCilindros: React.Dispatch<React.SetStateAction<string>>
    setAnioFabricacion: React.Dispatch<React.SetStateAction<string>>
    setRuedas: React.Dispatch<React.SetStateAction<string>>
    setCombustible: React.Dispatch<React.SetStateAction<string>>
    setFechaInscripcion: React.Dispatch<React.SetStateAction<string>>
    setPartidaRegistral: React.Dispatch<React.SetStateAction<string>>
    setClase: React.Dispatch<React.SetStateAction<string>>
}

const VehicleLooker = ({ 
    plate,
    setColor,
    setMarca,
    setModelo,
    setSerie,
    setCarroceria,
    setMotor,
    setCilindros,
    setAnioFabricacion,
    setRuedas,
    setCombustible,
    setFechaInscripcion,
    setPartidaRegistral,
    setClase,
}: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [disableButton, setDisableButton] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLookup = () => {

        setLoading(true);

        axios.get(`${import.meta.env.VITE_API_URL}detallevehicular/by_numplaca/?numplaca=${plate}`, {
            headers: { Authorization: `JWT ${access}` }
        })
        .then(response => {

            console.log('Vehicle data:', response.data);
            setDisableButton(true);
            setColor(response.data.color || '');
            setMarca(response.data.marca || '');
            setModelo(response.data.modelo || '');
            setSerie(response.data.numserie || '');
            setCarroceria(response.data.carroceria || '');
            setMotor(response.data.motor || '');
            setCilindros(response.data.numcil || '');
            setAnioFabricacion(response.data.anofab || '');
            setRuedas(response.data.numrueda || '');
            setCombustible(response.data.combustible || '');
            setFechaInscripcion(response.data.fecinsc || '');
            setPartidaRegistral(response.data.pregistral || '');
            setClase(response.data.clase || '');
        })
        .catch(() => {            
            axios.get(`${import.meta.env.VITE_FACTILIZA_PLATE_URL}${sanitaziedPlate}`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_FACTILIZA_TOKEN}` }
            })
            .then(response => {
                console.log('Vehicle data:', response.data);
                setDisableButton(true);
                setColor(response.data.data.color || '');
                setMarca(response.data.data.marca || '');
                setModelo(response.data.data.modelo || '');
                setSerie(response.data.data.serie || '');
            })
            .catch(error => {
                console.error('Error fetching vehicle data:', error);
            })
            .finally(() => {
                setLoading(false);
            })
        })
        .finally(() => {
            setLoading(false);
        });

        const sanitaziedPlate = plate.replace('-', '').replace(' ', '').toUpperCase();
        
    }

  return (
    <div>
        <button
            className={`gap-1 px-2 py-1 ${plate.length < 6 ? 'cursor-not-allowed  opacity-60' : 'cursor-pointer hover:bg-blue-600 transition-colors '} bg-blue-500 text-white rounded flex flex-col my-4 justify-center items-center`}
            type="button"
            onClick={handleLookup}
            disabled={plate.length < 6 || loading || disableButton}

        >
            {loading ? '...' : 'Buscar'}
        </button>
    </div>
  )
}

export default VehicleLooker