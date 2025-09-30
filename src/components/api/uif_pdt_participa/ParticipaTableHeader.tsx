const ParticipaTableHeader = () => {

  // MONTO
  // ORIGEN DE LOS FONDOS
  return (
    <div className="min-w-[1200px] grid grid-cols-11 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4 my-2 text-center  border-b-2 border-gray-200">
        <p className='col-span-2'>Acto</p>
        <p className='col-span-2'>Contratante</p>
        <p>Condición</p>
        <p>Porcentaje</p>
        <p>UIF</p>
        <p>Renta</p>
        <p>Monto</p>
        <p className='col-span-2'>Origen de Fondos</p>
    </div>
  )
}

export default ParticipaTableHeader