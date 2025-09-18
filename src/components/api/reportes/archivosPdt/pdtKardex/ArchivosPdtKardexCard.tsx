import { useState } from 'react'
import useAuthStore from '../../../../../store/useAuthStore'
import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import TopModal from '../../../../ui/TopModal'
import PreKardexForm from '../../registrosUif/PreKardexForm'

interface Props {
    error: PdtError
}

const ArchivosPdtKardexCard = ({ error }: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const [open, setOpen] = useState(false)
  return (
    <>
    <div className="grid grid-cols-5 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6 text-black">
        <p 
            onClick={() => setOpen(true)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer transition-all duration-300"
        >
            {error.kardex}
        </p>
        <p className="col-span-2">{error.typeAct}</p>
        <p className="col-span-2">{error.errorItem}</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <PreKardexForm
            isOpen={open}
            kardexId={error.idKardex}
        />
    </TopModal>
    </>
  )
}

export default ArchivosPdtKardexCard