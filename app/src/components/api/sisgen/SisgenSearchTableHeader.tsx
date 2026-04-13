import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useProcessDocument from "../../../hooks/sisgen/useProcessDocument"
import useAuthStore from "../../../store/useAuthStore"
import getSisgenDocs from "../../../utils/getSisgenDocs"
import useSearchSisgen from "../../../hooks/sisgen/useSearchSisgen"

interface Props {
  setPage: React.Dispatch<React.SetStateAction<number>>
  sisgenDocs: SISGENDocument[]
  instrumentType: number
  selectedFromDate: Date | undefined
  selectedToDate: Date | undefined
  selectedEstado: number
  page: number
  setSisgenDocs: React.Dispatch<React.SetStateAction<SISGENDocument[]>>
  setItemsCount: React.Dispatch<React.SetStateAction<number>>
  setSearchId: React.Dispatch<React.SetStateAction<string>>
  setNoDocsMessage: React.Dispatch<React.SetStateAction<string>>
  setErrorDisplay: React.Dispatch<React.SetStateAction<string>>
  searchId: string
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SisgenSearchTableHeader = ({ 
  setPage,
  sisgenDocs,
  instrumentType,
  selectedFromDate,
  selectedToDate,
  selectedEstado,
  // page,
  setSisgenDocs,
  setItemsCount,
  setSearchId,
  setNoDocsMessage,
  setErrorDisplay,
  searchId,
  setLoading,

 }: Props) => {

  const access = useAuthStore(s => s.access_token) || ''
  const [sendLoading, setSendLoading] = useState(false)
  const { setMessage, setShow, setType } =useNotificationsStore()
  const [documents, setDocuments] = useState<{kardex: string, idkardex: string}[]>(sisgenDocs.map(doc => ({kardex: doc.kardex, idkardex: doc.idkardex.toString()})))

  const sendDocuments = useProcessDocument()
  const searchSisgen = useSearchSisgen()

  useEffect(() => {
    setDocuments(sisgenDocs.map(doc => ({kardex: doc.kardex, idkardex: doc.idkardex.toString()})))
  }, [sisgenDocs])


  const handleSendAll = () => {
    console.log('Enviar Todos', documents)

    setSendLoading(true)
    sendDocuments.mutate({
      access,
      data: {
        documents,
        all: 0
      }
    }, {
      onSuccess: () => {
        setMessage('Todos los documentos han sido enviados correctamente')
        setShow(true)
        setType('success')
        setPage(1)
        getSisgenDocs({
          instrumentType,
          selectedFromDate,
          selectedToDate,
          selectedEstado,
          page: 1,
          setSisgenDocs,
          setItemsCount,
          setSearchId,
          setNoDocsMessage,
          setErrorDisplay,
          setLoading,
          access,
          searchSisgen,
      })
      },
      onError: () => {
        setMessage('Error al enviar los documentos')
        setShow(true)
        setType('error')
      },
      onSettled: () => {
        setSendLoading(false)
      }
    })
  }

  return (
    <div className="grid grid-cols-7 gap-4 bg-slate-200 text-black text-xs font-semibold p-2 mb-4 items-center">
        <p>Nº</p>
        <p className="col-span-2">Nº Kardex</p>
        <p>Acto</p>
        <p>Estado</p>
        <p>Errores</p>
        <button 
        className="bg-orange-500 text-white px-2 py-2 rounded-md cursor-pointer hover:bg-orange-600 transition-all duration-300 flex items-center justify-center"
        onClick={handleSendAll}
        disabled={sendLoading}
        >
            {sendLoading ? <Loader className="animate-spin w-4 h-4 text-center" /> : <p className="text-xs">Enviar Todos</p>}
        </button>
    </div>
  )
}

export default SisgenSearchTableHeader