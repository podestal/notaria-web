
export const SISGEN_BOOKS_GRID_COLUMNS =
  "48px minmax(100px,1fr) minmax(80px,0.8fr) minmax(110px,1fr) minmax(160px,2fr) minmax(140px,1.6fr) minmax(140px,1.4fr) minmax(150px,1.4fr) 120px"

const SisgenBooksTableHeader = () => {

  return (
    <div
        className="sticky top-0 z-10 grid items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur"
        style={{ gridTemplateColumns: SISGEN_BOOKS_GRID_COLUMNS }}
    >
        <p className="text-center">Nº</p>
        <p># Cronol.</p>
        <p>Tip. Per</p>
        <p>Ruc</p>
        <p>Cliente</p>
        <p>Tipo de Libro</p>
        <p>Estado</p>
        <p className="leading-tight">
            Validación
            <span className="block text-[9px] font-normal normal-case tracking-normal text-slate-400">
                Errores / Obs. / Personas
            </span>
        </p>
        <p></p>
    </div>
  )
}

export default SisgenBooksTableHeader
