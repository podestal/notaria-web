const LibrosTableHeader = () => {
    // Nº Cronologico	Fecha	Empresa / Cliente	Tipo Libro	N° de Libro	N° de Folio	Tipo de Folio	RUC	
  return (
    <div className="grid grid-cols-10 gap-4 justify-center items-center text-center bg-slate-200 text-black text-xs font-semibold p-2 my-4 mx-6">
        <div>Nº Cronologico</div>
        <div>Fecha</div>
        <div className="col-span-2">Empresa / Cliente</div>
        <div>Tipo Libro</div>
        <div>N° de Libro</div>
        <div>N° de Folio</div>
        <div>Tipo de Folio</div>
        <div>Ruc</div>
        <div>l</div>
    </div>
  )
}

export default LibrosTableHeader