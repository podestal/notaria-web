import { TriangleAlert } from 'lucide-react'

interface Props {
    onClick: () => void
    onClickMessage?: string
    onClickSecondary?: () => void
    onClickSecondaryMessage?: string
    message: string
}

const ExplanationMessage = ({ 
    onClick, 
    message,
    onClickMessage= 'Aceptar',
    onClickSecondary,
    onClickSecondaryMessage = 'Cancelar'

}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
        <TriangleAlert className="text-amber-400"/>
        <h2 className="text-lg text-center font-bold text-black">{message}</h2>
        <div className="my-6 flex justify-center items-center gap-12">
            <button 
                onClick={onClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors cursor-pointer"
            >
                {onClickMessage}
            </button>
            {onClickSecondary &&
            <button 
                onClick={onClickSecondary}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors cursor-pointer"
            >
                {onClickSecondaryMessage}
            </button>}
        </div>
    </div>
  )
}

export default ExplanationMessage