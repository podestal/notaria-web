import RemoveDetalleMediosDePago from "./RemoveDetalleMediosDePago"
import UpdateDetalleMediosDePago from "./UpdateDetalleMediosDePago"

const DetalleMediosDePagoBody = () => {
  return (
    <div className='grid grid-cols-8 gap-4 text-black text-xs p-2'>
        <p>ACT412-2025</p>
        <p className='col-span-2'>Depósito en cuenta</p>
        <p className='col-span-2'>BBVA Banco Continental</p>
        <p>50000.00</p>
        <p>29/03/1991</p>
        <div className="flex items-center justify-start gap-6">
        <UpdateDetalleMediosDePago />
        <RemoveDetalleMediosDePago />
        </div>
    </div>
  )
}

export default DetalleMediosDePagoBody