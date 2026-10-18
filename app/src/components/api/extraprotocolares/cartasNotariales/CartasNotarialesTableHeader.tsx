import { EXTRA_HEADER_CLASS } from "../ExtraTableShell"

export const CARTAS_GRID_COLUMNS =
  "minmax(90px,1fr) minmax(100px,1fr) minmax(110px,1.1fr) minmax(160px,2fr) minmax(160px,2fr)"

const items = [
  { label: "Nro Carta" },
  { label: "Fec. Ingreso" },
  { label: "Fec. Diligencia" },
  { label: "Remitente" },
  { label: "Destinatario" },
]

const CartasNotarialesTableHeader = () => {
  return (
    <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: CARTAS_GRID_COLUMNS }}>
      {items.map((item) => (
        <p key={item.label} className="text-left">{item.label}</p>
      ))}
    </div>
  )
}

export default CartasNotarialesTableHeader
