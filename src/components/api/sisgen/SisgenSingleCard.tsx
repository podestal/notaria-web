
import { useState } from "react"
import useProcessDocument from "../../../hooks/sisgen/useProcessDocument"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import getTitleCase from "../../../utils/getTitleCase"
import { ChevronDownIcon, ChevronUpIcon, AlertTriangleIcon, UserIcon } from "lucide-react"
import TopModal from "../../ui/TopModal"
import PreKardexForm from "../reportes/registrosUif/PreKardexForm"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}
const SisgenSingleCard = ({ sisgenDoc, idx }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } =useNotificationsStore()
    const [loading, setLoading] = useState(false)
    const sendDocument = useProcessDocument()
    const [showErrors, setShowErrors] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
  
    const handleSend = () => {
      console.log(sisgenDoc)
      setLoading(true)
  
      sendDocument.mutate({
  
        access,
        data: {
          idkardex: (sisgenDoc.idkardex).toString(),
          kardex: sisgenDoc.kardex,
          all: 0
        }
      }, {
        onSuccess: () => {
          setMessage('Documento enviado correctamente')
          setShow(true)
          setType('success')
        },
        onError: () => {
          setMessage('Error al enviar el documento')
          setShow(true)
          setType('error')
        },
        onSettled: () => {
          setLoading(false)
        }
      })
    }

  return (
    <>
        <div>
    <div 
        key={sisgenDoc.idkardex} 
        className="grid grid-cols-7 gap-4 p-2 border-b text-xs align-middle"
    >
        <p>{idx}</p>
        <p 
            
            className="col-span-2 text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => setIsOpen(true)}
        >
            {sisgenDoc.kardex}
        </p>
        <p>{getTitleCase(sisgenDoc.contrato)}</p>
        <p>{sisgenDoc.estado_sisgen}</p>
        {showErrors ? <ChevronUpIcon 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            onClick={() => setShowErrors(!showErrors)}
        /> : <ChevronDownIcon 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            onClick={() => setShowErrors(!showErrors)}
        />}
        <button 
          onClick={handleSend}
          className="bg-amber-500 w-[100px] text-white px-4 py-1 rounded-md cursor-pointer hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
    </div>
    {showErrors && (
        <div className="p-4 text-xs flex flex-col gap-2">
            <div>
                <h3 className="font-semibold mb-2">Errores Sisgen</h3>
                <>
                {sisgenDoc.errores.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p >{error}</p>
                    </div>
                ))}
                </>
                <>
                    {sisgenDoc.observaciones.map((observacion, idx) => (
                        <div key={idx + 'observacion'} className="flex items-center gap-2">
                            <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                            <p >{observacion}</p>
                        </div>
                    ))}
                </>
                <>
                    {sisgenDoc.personas.map((persona, idx) => (
                        <div key={idx + 'persona'} className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-blue-500" />
                            <p >{persona}</p>
                        </div>
                    ))}
                </>
            </div>
            <div>
            <h3 className="font-semibold mb-2">Errores Uif</h3>
            <>
                {sisgenDoc.uif_validation.errors.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p className="text-xs">{error.error_description}</p>
                    </div>
                ))}
                {sisgenDoc.uif_validation.observations.map((observation, idx) => (
                    <div key={idx + 'observation'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                        <p className="text-xs">{observation}</p>
                    </div>
                ))}
            </>
            </div>
            <h3 className="font-semibold">Errores Pdt</h3>

        </div>
    )}
    </div>
    <TopModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
    >
        <PreKardexForm
            isOpen={isOpen}
            kardexId={sisgenDoc.idkardex}
        />
    </TopModal>
    </>
  )
}

export default SisgenSingleCard