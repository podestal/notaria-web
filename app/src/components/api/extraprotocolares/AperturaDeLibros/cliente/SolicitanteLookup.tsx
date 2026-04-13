import axios from "axios"
import SimpleInput from "../../../../ui/SimpleInput"
import { useState } from "react"
import { MessageSquareText, UserSearch } from "lucide-react"
import TopModal from "../../../../ui/TopModal"
import useAuthStore from "../../../../../store/useAuthStore"

interface Props {
    solicitanteName: string
    setSolicitanteName: (name: string) => void
    solicitanteDocument: string
    setSolicitanteDocument: (document: string) => void
    comentario: string
    setComentario: (comentario: string) => void
    solicitanteNameError: string
    setSolicitanteNameError: (solicitanteNameError: string) => void
}

const SolicitanteLookup = ({ 
    solicitanteName, 
    setSolicitanteName, 
    solicitanteDocument, 
    setSolicitanteDocument, 
    comentario, 
    setComentario, 
    solicitanteNameError,
    setSolicitanteNameError,
 }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [documentError, setDocumentError] = useState('');

    const handleLookup = () => {

        if (solicitanteDocument.length !== 8) {
            setDocumentError('El documento debe tener 8 dígitos');
            return;
        }

        setLoading(true);
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${solicitanteDocument}`,
            {
                headers: {
                    'Authorization': `JWT ${access}`
                }
            }
        ).then(response => {
            console.log(response.data);
            if (response.data.idcliente) {
                setSolicitanteName(response.data.nombre || `${response.data.apepat} ${response.data.apemat} ${response.data.prinom} ${response.data.segnom}`);
            } else {
                axios.get(`${import.meta.env.VITE_PERUDEVS_DNI_URL}document=${solicitanteDocument}&key=${import.meta.env.VITE_PERUDEVS_TOKEN}`
                ).then(response => {
                    console.log('response', response.data)
                    setSolicitanteName(`${response.data.resultado.nombres.split(' ')[0]} ${response.data.resultado.apellido_paterno} ${response.data.resultado.apellido_materno}`)
                }).catch(error => {
                    console.error('Error al consultar RENIEC:', error)
                });
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

  return (
    <>
        <SimpleInput
            label="Nombre"
            value={solicitanteName}
            setValue={setSolicitanteName}
            horizontal
            fullWidth
            error={solicitanteNameError}
            setError={setSolicitanteNameError}
            disabled
        />
        <div className="flex justify-between items-center my-4">
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleInput
                    label="Documento"
                    value={solicitanteDocument}
                    setValue={setSolicitanteDocument}
                    horizontal
                    error={documentError}
                    setError={setDocumentError}
                />
                <div 
                    onClick={handleLookup}
                    className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors">
                    <UserSearch className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mb-2" />
                    <p className="text-[10px] text-center text-gray-700">Reniec</p>
                </div>
            </div>
            <div 
                onClick={() => setOpen(true)}
                className={`flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors`}>
                <MessageSquareText className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mb-2" />
                <p className="text-[10px] text-center text-gray-700">Comentarios</p>
            </div>
        </div>
        <TopModal
            isOpen={open}
            onClose={() => {
                setOpen(false);
        }}
        >
            <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-lg font-bold text-center mx-8">Comentario</h2>
            <textarea
                value={comentario}
                className="w-[90%] h-40 p-2 border border-gray-300 rounded-md mt-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mx-8"
                onChange={(e) => setComentario(e.target.value)}
            />
            <button 
                onClick={() => setOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300 cursor-pointer">Guardar</button>
            </div>
        </TopModal>

    </>
  )
}

export default SolicitanteLookup