const PatrimonialTableBody = () => {
  return (
    <div className='grid grid-cols-8 gap-4 text-black text-xs p-2 my-2'>
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

export default PatrimonialTableBody