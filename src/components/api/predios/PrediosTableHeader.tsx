const PrediosTableHeader = () => {
    // N°	TIPO DE ZONA	ZONA	DENOMINACION	TIPO DE VIA	NOMBRE DE VIA	NUMERO	MANZANA	LOTE
  return (
    <div className="grid grid-cols-11 gap-4 font-semibold text-xs bg-slate-100 text-center items-center">
        <p>Tipo de Zona</p>
        <p className="col-span-2">Zona</p>
        <p className="col-span-2">Denominación</p>
        <p>Tipo de Vía</p>
        <p className="col-span-2">Nombre de Vía</p>
        <p>Número</p>
        <p>Manzana</p>
        <p>Lote</p>
    </div>
  )
}

export default PrediosTableHeader