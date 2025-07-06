

const DetalleMediosDePagoHeader = () => {
  return (
    <div className='grid grid-cols-8 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4'>
        <p>Kardex - Año</p>
        <p className='col-span-2'>Medio de Pago</p>
        <p className='col-span-2'>Banco</p>
        <p>Importe</p>
        <p>Fec. operación</p>
    </div>
  )
}

export default DetalleMediosDePagoHeader