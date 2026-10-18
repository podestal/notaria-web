import { EXTRA_HEADER_CLASS } from "../ExtraTableShell"

export const DOMICILIARIO_GRID_COLUMNS =
  "minmax(110px,1.1fr) minmax(100px,1fr) minmax(160px,1.8fr) minmax(160px,1.8fr) minmax(180px,2fr)"

const items = [
  { label: "Nro. Certificado" },
  { label: "Fec. Ingreso" },
  { label: "Solicitante" },
  { label: "Motivo" },
  { label: "Dirección" },
]

const DomiciliarioTableHeader = () => {
  return (
    <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: DOMICILIARIO_GRID_COLUMNS }}>
      {items.map((item) => (
        <p key={item.label} className="text-left">{item.label}</p>
      ))}
    </div>
  )
}

export default DomiciliarioTableHeader
