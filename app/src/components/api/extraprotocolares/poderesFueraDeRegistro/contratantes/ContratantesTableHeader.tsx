import { EXTRA_HEADER_CLASS } from "../../ExtraTableShell"

export const CONTRATANTES_GRID_COLUMNS =
  "48px minmax(100px,1fr) minmax(180px,2fr) 72px minmax(120px,1.2fr) 88px"

const items = [
  { label: "No" },
  { label: "Código" },
  { label: "Nombre" },
  { label: "Firma" },
  { label: "Condición" },
  { label: "" },
]

const ContratantesTableHeader = () => {
  return (
    <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: CONTRATANTES_GRID_COLUMNS }}>
      {items.map((item, i) => (
        <p key={item.label || `actions-${i}`} className="text-left">{item.label}</p>
      ))}
    </div>
  )
}

export default ContratantesTableHeader
