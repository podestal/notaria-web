import { SquareX } from "lucide-react"
import useRemoveContratante from "../../../hooks/api/contratantes/useRemoveContratante"

interface Props {
    contratanteId: string
    kardex: string
}

const RemoveContratante = ({ contratanteId, kardex }: Props) => {

    const removeContratante = useRemoveContratante({ kardex, contratanteId })

    const handleRemove = () => {
        removeContratante.mutate({ access: '' })
    }

  return (
    <button
        onDoubleClick={handleRemove}
    >
        <SquareX 
            size={20}
            className="text-red-500 hover:text-red-400 cursor-pointer"
        />
    </button>
  )
}

export default RemoveContratante