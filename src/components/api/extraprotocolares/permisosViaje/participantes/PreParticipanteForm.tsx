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
        ubigeo: string | null;
        estadoCivil: number;
        genero: string;
        nacionalidad: string;
    }>>
    setDocument: React.Dispatch<React.SetStateAction<string>>
    document: string
    participantesDocs: string[]
}

const PreParticipanteForm = ({ setContratanteInfo, setDocument, document, participantesDocs }: Props) => {

    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1);
    const [loading, setLoading] = useState(false);
    const [alreadyExists, setAlreadyExists] = useState('');

    const handleClienteLookup = () => {
        setLoading(true);
        setAlreadyExists('');

        if (participantesDocs.includes(document)) {
            setAlreadyExists('Un participante con este documento ya existe');
            setLoading(false);
            return;
        }

        // initialize contratanteInfo
        setContratanteInfo({
            apePaterno: '',
            apeMaterno: '',
            priNombre: '',
            segNombre: '',
            direccion: '',
            ubigeo: null,
            estadoCivil: 0,
            genero: '',
            nacionalidad: ''
        })
    
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`
        ).then(response => {
            if (response.data.idcliente) {
                console.log('Cliente encontrado:', response.data);
                setContratanteInfo({
                    apePaterno: response.data.apepat,
                    apeMaterno: response.data.apemat,
                    priNombre: response.data.prinom,
                    segNombre: response.data.segnom,
                    direccion: response.data.direccion,
                    ubigeo: response.data.idubigeo,
                    estadoCivil: response.data.idestcivil,
                    genero: response.data.sexo,
                    nacionalidad: response.data.nacionalidad
                });
            } else {
                console.log('Cliente no encontrado, buscando en RENIEC')
                handleReniec(document)
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleReniec = (dni: string) => {
        console.log('Consulta RENIEC')
        axios.get(`${import.meta.env.VITE_PERUDEVS_DNI_URL}document=${dni}&key=${import.meta.env.VITE_PERUDEVS_TOKEN}`
        ).then(response => {
            console.log('response', response.data)
            setContratanteInfo({
                apePaterno: response.data.resultado.apellido_paterno || '',
                apeMaterno: response.data.resultado.apellido_materno || '',
                priNombre: response.data.resultado.nombres.split(' ')[0] || '',
                segNombre: response.data.resultado.nombres.split(' ')[1] || '',
                genero: response.data.resultado.genero,
                nacionalidad: '',
                direccion: '',
                ubigeo: null,
                estadoCivil: 0
            })

        }).catch(error => {
            console.error('Error al consultar RENIEC:', error)
        });

        
    }

  return (
    <>
    {alreadyExists && <p className="text-red-500 text-center text-xs my-6">{alreadyExists}</p>}
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
    </>
  )
}

export default PreParticipanteForm