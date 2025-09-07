import { useState } from "react"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}

const SisgenBookCard = ({ sisgenDoc, idx }: Props) => {

  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleSend = () => {
    setLoading(true)
    setIsDisabled(true)
  }
  return (
    <div className="grid grid-cols-8 gap-4 p-2 border-b text-xs align-middle">
        <p>{idx}</p>
        <p>{sisgenDoc.libro}</p>
        <p>{sisgenDoc.tipoPersona}</p>
        <p>{sisgenDoc.ruc}</p>
        <p>{getTitleCase(sisgenDoc.empresa || '')}</p>
        <p>{getTitleCase(sisgenDoc.descripcionTipoLibro || '')}</p>
        <p>{getTitleCase(sisgenDoc.estadoSisgen || '')}</p>
        {sisgenDoc.estadoSisgen?.toLocaleLowerCase() !== "enviado" 
        ? 
        <button 
          onClick={handleSend}
          className="bg-blue-500 w-[100px] h-[28px] text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || isDisabled}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button> 
        :
        <button 
        // onClick={handleSend}
        className="bg-green-500 w-[100px] h-[28px] text-white px-4 py-1 rounded-md cursor-not-allowed "
        // disabled
      >
        Guardado
      </button>
        }
    </div>
  )
}

export default SisgenBookCard