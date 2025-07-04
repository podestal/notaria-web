

const DigitacionTableHeader = () => {
  return (
    <div className="grid grid-cols-14 text-center gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4">
        <p className="col-span-2">Tipo</p>
        <p className="col-span-2">Documento</p>
        <p className="col-span-2">Fecha</p>
        <p className="col-span-2">Hora</p>
        <p className="col-span-2">Usuario</p>
        <p>Proy</p>
        <p>Part</p>
        <p>Test</p>
        <p>Reg</p>
    </div>
  )
}

export default DigitacionTableHeader