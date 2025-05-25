const KardexErrorsTableHeader = () => {
  return (
    <div className="grid grid-cols-8 bg-neutral-500 text-center text-xs h-6 place-items-center text-slate-50 font-semibold gap-2">
        <p>N</p>
        <p>Kardex</p>
        <p>Fecha</p>
        <p>Acto</p>
        <p className="col-span-2">Descripción del Error</p>
        <p>Usuario</p>
        <p>Estado</p>
    </div>
  )
}

export default KardexErrorsTableHeader