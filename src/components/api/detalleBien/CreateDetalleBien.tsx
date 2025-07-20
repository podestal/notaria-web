import { useState } from 'react'
import TopModal from '../../ui/TopModal'
import { Building2 } from 'lucide-react'

interface Props {
  kardex: string
  idtipoacto: string
}

const CreateDetalleBien = ({ kardex, idtipoacto }: Props) => {
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
            <div>
                <p>Detalle bienes form</p>
                <p>{kardex}</p>
                <p>{idtipoacto}</p>
                {/* Aquí puedes agregar el formulario para crear un detalle de bien */}
            </div>

        </TopModal>
    </>
  )
}

export default CreateDetalleBien