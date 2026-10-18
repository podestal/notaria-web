import { EXTRA_HEADER_CLASS } from "../ExtraTableShell"

export const PODERES_GRID_COLUMNS =
  "minmax(90px,1fr) minmax(90px,0.9fr) minmax(160px,1.8fr) minmax(90px,0.9fr) minmax(180px,2fr) minmax(90px,0.9fr)"

const items = [
  { label: "Nro Control" },
  { label: "Cronológico" },
  { label: "Tipo de Poder" },
  { label: "Fec. Crono" },
  { label: "Contratantes" },
  { label: "Fec. Ingreso" },
]

const PoderesFueraDeRegistroTableHeader = () => {
  return (
    <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: PODERES_GRID_COLUMNS }}>
      {items.map((item) => (
        <p key={item.label} className="text-left">{item.label}</p>
      ))}
    </div>
  )
}

export default PoderesFueraDeRegistroTableHeader
