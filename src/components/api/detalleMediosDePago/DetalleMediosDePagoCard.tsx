import UpdateDetalleMediosDePago from './UpdateDetalleMediosDePago'
import RemoveDetalleMediosDePago from './RemoveDetalleMediosDePago'
import { DetalleMedioDePago } from '../../../services/api/detalleMedioDePago'
import { MEDIOS_PAGO, BANCOS } from '../../../data/patrimonialData'

interface Props {
    detalleMedioDePago: DetalleMedioDePago
}

const DetalleMediosDePagoCard = ({ detalleMedioDePago }: Props) => {
  return (
    <div className='grid grid-cols-8 gap-4 text-black text-xs p-2'>
        <p>{detalleMedioDePago.kardex}</p>
        <p className='col-span-2'>{MEDIOS_PAGO.find(medioPago => detalleMedioDePago.codmepag === medioPago.codmepag)?.desmpagos || 'N/A'}</p>
        <p className='col-span-2'>{BANCOS.find(banco => detalleMedioDePago.idbancos === banco.idbancos)?.desbanco || 'N/A'}</p>
        <p>{detalleMedioDePago.importemp}</p>
        <p>{detalleMedioDePago.foperacion}</p>
        <div className="flex items-center justify-start gap-6">
            <UpdateDetalleMediosDePago />
            <RemoveDetalleMediosDePago />
        </div>
    </div>
  )
}

export default DetalleMediosDePagoCard