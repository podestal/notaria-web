import { File } from "lucide-react"
import { useState } from "react"

const CreateContratantes = () => {
  const [open, setOpen] = useState(false)
    
  return (
        <div 
            onClick={() => setOpen(true)}
            className="mx-6 w-28 flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
            <File className="text-white text-xl"/>
            <p className="text-xs font-bold">Nuevo</p>
        </div>
  )
}

export default CreateContratantes