import { useState } from 'react';
import { Domiciliario } from '../../../../services/api/extraprotocolares/domiciliarioService'
import TopModal from '../../../ui/TopModal';
import UpdateDomiciliario from './UpdateDomiciliario';
import useUpdateDomiciliario from '../../../../hooks/api/extraprotocolares/domiciliario/useUpdateDomiciliario';

interface Props {
    domiciliario: Domiciliario;
    readyOnly?: boolean;
}

const DomiciliarioCard = ({ domiciliario, readyOnly }: Props) => {

    const [open, setOpen] = useState(false);
    const updateDomiciliario = useUpdateDomiciliario({ domiciliarioId: domiciliario.id_domiciliario, page: 1 });
  return (
    <>
    <div className='grid grid-cols-8 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6'>
        <p 
            onClick={() => {
                if (readyOnly) return;
                setOpen(true)
            }}
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
        <UpdateDomiciliario 
            updateDomiciliario={updateDomiciliario}
            domiciliario={domiciliario}
        />
    </TopModal>
    </>
  )
}

export default DomiciliarioCard