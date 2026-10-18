import { EXTRA_HEADER_CLASS } from "../ExtraTableShell"

export const LIBROS_GRID_COLUMNS =
  "minmax(110px,1.1fr) minmax(90px,0.9fr) minmax(180px,2fr) minmax(110px,1.1fr) minmax(90px,0.9fr) minmax(80px,0.8fr) minmax(100px,1fr) minmax(110px,1fr)"

const items = [
  { label: "Nº Cronológico" },
  { label: "Fecha" },
  { label: "Empresa / Cliente" },
  { label: "Tipo Libro" },
  { label: "N° de Libro" },
  { label: "N° de Folio" },
  { label: "Tipo de Folio" },
  { label: "RUC" },
]

const LibrosTableHeader = () => {
  return (
    <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: LIBROS_GRID_COLUMNS }}>
      {items.map((item) => (
        <p key={item.label} className="text-left">{item.label}</p>
      ))}
    </div>
  )
}

export default LibrosTableHeader
