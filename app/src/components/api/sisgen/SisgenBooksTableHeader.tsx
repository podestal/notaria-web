
const SisgenBooksTableHeader = () => {


// Nº	# Cronol.	Tip. Per	Ruc	Cliente	Tipo de Libro	Estado Sisgen
  return (
    <div className="grid grid-cols-9 gap-4 bg-slate-200 text-black text-xs font-semibold p-2 mb-4">
        <p>Nº</p>
        <p># Cronol.</p>
        <p>Tip. Per</p>
        <p>Ruc</p>
        <p>Cliente</p>
        <p>Tipo de Libro</p>
        <p>Errores Pdt</p>
        <p>Estado Sisgen</p>
    </div>
  )
}

export default SisgenBooksTableHeader