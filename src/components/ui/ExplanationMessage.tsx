import { TriangleAlert } from 'lucide-react'

interface Props {
    onClick: () => void
    message: string
}

const ExplanationMessage = ({ onClick, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
        <TriangleAlert className="text-amber-400"/>
        <h2 className="text-lg text-center font-bold">{message}</h2>
        <div className="my-6">
            <button 
                onClick={onClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors cursor-pointer"
            >
                Aceptar
            </button>
        </div>
    </div>
  )
}

export default ExplanationMessage