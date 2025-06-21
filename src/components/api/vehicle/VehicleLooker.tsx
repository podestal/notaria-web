import axios from "axios"
import { useState } from "react";

interface Props {
    plate: string
}

const VehicleLooker = ({ plate }: Props) => {

    const [disableButton, setDisableButton] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLookup = () => {

        setLoading(true);
        const sanitaziedPlate = plate.replace('-', '').replace(' ', '').toUpperCase();

        axios.get(`${import.meta.env.VITE_FACTILIZA_PLATE_URL}${sanitaziedPlate}`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_FACTILIZA_TOKEN}` }
        })
        .then(response => {
            console.log('Vehicle data:', response.data);
            setDisableButton(true);
            // Aquí puedes manejar la respuesta, por ejemplo, mostrarla en un modal o en un componente
        })
        .catch(error => {
            console.error('Error fetching vehicle data:', error);
            // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje al usuario
        })
        .finally(() => {
            setLoading(false);
        })


        
        // const options = {method: 'GET', headers: {Authorization: `Bearer ${import.meta.env.VITE_FACTILIZA_TOKEN}`}};

        // fetch(`https://api.factiliza.com/v1/placa/info/${plate}`, options)
        // .then(response => response.json())
        // .then(response => {
        //     console.log(response)
        //     setLoading(false);
        // })
        // .catch(err => {
        //     console.error(err)
        //     setLoading(false);
        // });
        

        
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