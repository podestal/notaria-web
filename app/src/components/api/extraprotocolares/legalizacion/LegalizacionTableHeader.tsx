import { EXTRA_HEADER_CLASS } from "../ExtraTableShell"

export const LEGALIZACION_GRID_COLUMNS =
  "minmax(140px,1.2fr) minmax(120px,1fr) minmax(180px,2fr)"

const items = [
  { label: "Nro. Legalización" },
  { label: "Fec. Ingreso" },
  { label: "Cliente" },
]

const LegalizacionTableHeader = () => {
  return (
    <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: LEGALIZACION_GRID_COLUMNS }}>
      {items.map((item) => (
        <p key={item.label} className="text-left">{item.label}</p>
      ))}
    </div>
  )
}

export default LegalizacionTableHeader
