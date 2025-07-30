import { useState } from "react";
import Selector from "../../../../ui/Selector"
import axios from "axios";
import { documentNaturalOptions } from "../../../../../data/clienteData";

interface Props {
    setContratanteInfo: React.Dispatch<React.SetStateAction<{
        apePaterno: string;
        apeMaterno: string;
        priNombre: string;
        segNombre: string;
        direccion: string;
        ubigeo: string;
        estadoCivil: string;
        genero: string;
        nacionalidad: string;
    }>>
}

const PreParticipanteForm = ({ setContratanteInfo }: Props) => {

    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1);
    const [document, setDocument] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClienteLookup = () => {
        setLoading(true);
        // Simulate an API call
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`
        ).then(response => {
            if (response.data.idcliente) {
                console.log('Cliente encontrado:', response.data);
                setContratanteInfo({
                    apePaterno: response.data.ape_paterno,
                    apeMaterno: response.data.ape_materno,
                    priNombre: response.data.pri_nombre,
                    segNombre: response.data.seg_nombre,
                    direccion: response.data.direccion,
                    ubigeo: response.data.ubigeo,
                    estadoCivil: response.data.estado_civil,
                    genero: response.data.genero,
                    nacionalidad: response.data.nacionalidad
                });
            } else {
                console.log('Cliente no encontrado, creando nuevo cliente')
                // setCliente1(null)
                // setShowContratanteForm(false)
                // setShowClienteForm(true)
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

  return (
    <div className="grid grid-cols-5 gap-4">
        <div className="w-full col-span-2">
            <Selector 
                label="Tipo de documento"
                options={documentNaturalOptions}
                setter={setSelectedTipoDocumento}
                defaultValue={selectedTipoDocumento}
            />
        </div>
        {selectedTipoDocumento > 0 && 
        <div className="flex flex-col gap-2 col-span-2">
            <p className="text-md font-bold py-2">{documentNaturalOptions.find(document => document.value === selectedTipoDocumento)?.label}</p>
            <input 
                type="text"
                value={document}
                onChange={e => setDocument(e.target.value)}
                placeholder={documentNaturalOptions.find(document => document.value === selectedTipoDocumento)?.label || ''}
                className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
            />
        </div>}
        {selectedTipoDocumento > 0 && 
        <div className="flex justify-center items-center">
            <button 
                onClick={handleClienteLookup}
                disabled={document.length === 0 || loading}
                className={`w-[60%] mx-auto bg-blue-600 text-white rounded-md py-2 mt-4 transition-colors duration-300 ${loading && 'animate-pulse'} ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                type="submit">
                {loading ? '...' : 'Buscar'}
            </button>
        </div>
        }
    </div>
  )
}

export default PreParticipanteForm