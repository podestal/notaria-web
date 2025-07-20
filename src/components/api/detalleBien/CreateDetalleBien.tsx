import { useState } from 'react'
import TopModal from '../../ui/TopModal'
import { Building2 } from 'lucide-react'
import PreDetalleBienForm from './PreDetalleBienForm'

const CreateDetalleBien = () => {
    const [open, setOpen] = useState(false)

  return (
    <>
        <button
            className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
            type="button"
            onClick={() => setOpen(true)}
        >
            <Building2 />
            <p className="text-xs">Nuevo</p>
        </button>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <PreDetalleBienForm 
                
            />
        </TopModal>
    </>
  )
}

export default CreateDetalleBien