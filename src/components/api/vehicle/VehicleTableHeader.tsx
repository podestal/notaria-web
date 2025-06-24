const VehicleTableHeader = () => {
  return (
    <div className="grid grid-cols-7 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4">
        <p>Tipo</p>
        <p>Numero</p>
        <p>Clase</p>
        <p>Marca</p>
        <p>Color</p>
        <p>Motor</p>
    </div>
  )
}

export default VehicleTableHeader