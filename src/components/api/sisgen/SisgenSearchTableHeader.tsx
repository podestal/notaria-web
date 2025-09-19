import { Loader } from "lucide-react"
import { useState } from "react"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const SisgenSearchTableHeader = ({ setPage }: Props) => {

  const [loading, setLoading] = useState(false)
  const { setMessage, setShow, setType } =useNotificationsStore()


  const handleSendAll = () => {
    setLoading(true)
    console.log('Enviar Todos')
    setTimeout(() => {
      setLoading(false)
      setMessage('Todos los documentos han sido enviados correctamente')
      setShow(true)
      setType('success')
      // setPage(2)
    }, 1000)
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
        disabled={loading}
        >
            {loading ? <Loader className="animate-spin w-4 h-4 text-center" /> : <p className="text-xs">Enviar Todos</p>}
        </button>
    </div>
  )
}

export default SisgenSearchTableHeader