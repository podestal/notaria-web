import { LibraryBig, Search } from "lucide-react"

interface Props {
    title: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleReset?: () => void
}


const GenericHeader = ({ 
  title, 
  setOpen, 
  handleReset 
}: Props) => {

  return (
    <div className="w-full flex justify-between items-center bg-slate-700 p-4 rounded-t-lg text-slate-50">
        <div className="flex items-center gap-2">
          <LibraryBig 
            className="text-green-700"
          />
          <h2 className="text-amber-500">{title}</h2>
        </div>
        <div className="flex justify-center items-center gap-8 text-sm">
            <button 
                onClick={() => setOpen(true)}
                className="hover:opacity-80 cursor-pointer flex items-center justify-center gap-2">
                <span className="font-bold text-2xl text-green-600">+</span>
                <span className="border-b-2 border-amber-500 pb-1">Nuevo</span>
            </button>
            <span>|</span>
            <div 
              onClick={() => handleReset?.()}
              className="flex items-center gap-2 hover:opacity-80 cursor-pointer">
            <Search 
              size={20}
              className="text-blue-400"
            />
            <p className="border-b-2 border-amber-500 pb-1">Buscar</p>
            </div>
        </div>
    </div>
  )
}

export default GenericHeader