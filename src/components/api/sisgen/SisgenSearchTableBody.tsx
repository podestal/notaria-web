import { useState } from "react"
import useProcessDocument from "../../../hooks/sisgen/useProcessDocument"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}

const SisgenSearchTableBody = ({ sisgenDoc, idx }: Props) => {

  const access = useAuthStore(s => s.access_token) || ''
  const { setMessage, setShow, setType } =useNotificationsStore()
  const [loading, setLoading] = useState(false)
  const sendDocument = useProcessDocument()

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
    <div key={sisgenDoc.idkardex} className="grid grid-cols-6 gap-4 p-2 border-b text-xs align-middle">
        <p>{idx}</p>
        <p className="col-span-2">{sisgenDoc.kardex}</p>
        <p>{getTitleCase(sisgenDoc.contrato)}</p>
        <p>{sisgenDoc.estado_sisgen}</p>
        <button 
          onClick={handleSend}
          className="bg-amber-500 w-[100px] text-white px-4 py-1 rounded-md cursor-pointer hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
    </div>
  )
}
  

export default SisgenSearchTableBody