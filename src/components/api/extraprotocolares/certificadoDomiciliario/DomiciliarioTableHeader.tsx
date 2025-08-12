const DomiciliarioTableHeader = () => {

  return (
    <div className="grid grid-cols-8 gap-4 justify-center items-center text-center bg-slate-200 text-black text-xs font-semibold p-2 my-4 mx-6">
        <p>Nro. Certificado</p>
        <p>Fecha Ingreso</p>
        <p className="col-span-2">Solicitante</p>
        <p className="col-span-2">Motivo</p>
        <p className="col-span-2">Direccion</p>
    </div>
  )
}

export default DomiciliarioTableHeader