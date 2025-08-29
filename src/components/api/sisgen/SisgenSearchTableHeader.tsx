

const SisgenSearchTableHeader = () => {
  return (
    <div className="grid grid-cols-6 gap-4 bg-slate-200 text-black text-xs font-semibold p-2 mb-4">
        <p>Nº</p>
        <p className="col-span-2">Nº Kardex</p>
        <p>Acto</p>
        <p>Estado</p>
    </div>
  )
}

export default SisgenSearchTableHeader