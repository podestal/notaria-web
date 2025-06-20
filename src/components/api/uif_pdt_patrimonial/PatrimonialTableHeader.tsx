const PatrimonialTableHeader = () => {
  return (
    <div className='grid grid-cols-8 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4'>
        <p>Itenmp</p>
        <p>Kardex - Año</p>
        <p className='col-span-2'>Descripción</p>
        <p>Fecha de acta</p>
        <p>Moneda</p>
        <p>Importe</p>
        <p>Ex. Bien</p>
    </div>
  )
}

export default PatrimonialTableHeader