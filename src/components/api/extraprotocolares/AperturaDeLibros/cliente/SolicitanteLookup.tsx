import axios from "axios"
import SimpleInput from "../../../../ui/SimpleInput"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface Props {
    solicitanteName: string
    setSolicitanteName: (name: string) => void
    solicitanteDocument: string
    setSolicitanteDocument: (document: string) => void
}

const SolicitanteLookup = ({ solicitanteName, setSolicitanteName, solicitanteDocument, setSolicitanteDocument }: Props) => {

    const [loading, setLoading] = useState(false);

    const handleLookup = () => {
        setLoading(true);
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${solicitanteDocument}`
        ).then(response => {
            console.log(response.data);
            if (response.data.idcliente) {
                setSolicitanteName(response.data.nombre || `${response.data.apepat} ${response.data.apemat} ${response.data.prinom} ${response.data.segnom}`);
            } else {
                console.log('Cliente no encontrado, creando nuevo cliente')
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
        />
       <div className="grid grid-cols-2 gap-4 my-4">
     
            <SimpleInput
                label="Documento"
                value={solicitanteDocument}
                setValue={setSolicitanteDocument}
                horizontal
            />
            <div className="flex justify-end">
                <button 
                    onClick={handleLookup}
                    disabled={loading || solicitanteDocument.length !== 8}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-md  cursor-pointer ${loading || solicitanteDocument.length !== 8 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition-all duration-300'}`}
                >{loading ? <Loader2 className="animate-spin" /> : 'Buscar'}</button>
            </div>
       </div>
    </>
  )
}

export default SolicitanteLookup