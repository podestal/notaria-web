const ParticipaTableHeader = () => {

//     ACTO
// CONTRATANTE
// CONDICION
// PORCENTAJE
// UIF
// RENTA
  return (
    <div className="grid grid-cols-11 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4 my-2 place-content-center border-b-2 border-gray-200 text-center">
        <p className='col-span-3'>Acto</p>
        <p className='col-span-3'>Contratante</p>
        <p className='col-span-2'>Condición</p>
        <p>Porcentaje</p>
        <p>UIF</p>
        <p>Renta</p>
    </div>
  )
}

export default ParticipaTableHeader