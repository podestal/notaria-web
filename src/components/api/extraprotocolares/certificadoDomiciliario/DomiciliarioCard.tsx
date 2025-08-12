import { useState } from 'react';
import { Domiciliario } from '../../../../services/api/extraprotocolares/domiciliarioService'
import TopModal from '../../../ui/TopModal';
import UpdateDomiciliario from './UpdateDomiciliario';

interface Props {
    domiciliario: Domiciliario;
}

const DomiciliarioCard = ({ domiciliario }: Props) => {

    const [open, setOpen] = useState(false);
  return (
    <>
    <div className='grid grid-cols-8 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6'>
        <p 
            onClick={() => setOpen(true)}
            className="text-center text-blue-600 cursor-pointer hover:text-blue-500"
        >{domiciliario.num_certificado}</p>
        <p>{domiciliario.fec_ingreso}</p>
        <p className="col-span-2">{domiciliario.nombre_solic}</p>
        <p className="col-span-2">{domiciliario.motivo_solic}</p>
        <p className="col-span-2">{domiciliario.domic_solic}</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <UpdateDomiciliario />
    </TopModal>
    </>
  )
}

export default DomiciliarioCard