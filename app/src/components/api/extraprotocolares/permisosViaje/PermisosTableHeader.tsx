

const PermisosTableHeader = () => {

  return (
    <div className="grid grid-cols-9 gap-4 justify-center items-center text-center bg-slate-200 text-black text-xs font-semibold p-2 my-4 mx-6">
      <div>Nro Control</div>
      <div>Cronológico</div>
      <div className="col-span-2">Participantes</div>
      <div>Fecha Crono.</div>
      <div>Tip. Permiso</div>
      <div>Fec. Ingreso</div>
      <div className="col-span-2">Descripción</div>
    </div>
  )
}

export default PermisosTableHeader