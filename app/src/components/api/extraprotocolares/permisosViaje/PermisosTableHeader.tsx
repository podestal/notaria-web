import { EXTRA_HEADER_CLASS } from "../ExtraTableShell"

export const PERMISOS_GRID_COLUMNS =
  "minmax(100px,1fr) minmax(90px,0.9fr) minmax(220px,2.2fr) minmax(90px,0.9fr) minmax(110px,1.1fr) minmax(90px,0.9fr) minmax(160px,1.6fr)"

const items = [
  { label: "Nro Control", align: "left" },
  { label: "Cronológico", align: "left" },
  { label: "Participantes", align: "left" },
  { label: "Fecha Crono.", align: "left" },
  { label: "Tip. Permiso", align: "left" },
  { label: "Fec. Ingreso", align: "left" },
  { label: "Descripción", align: "left" },
]

const PermisosTableHeader = () => {
  return (
    <div
      className={EXTRA_HEADER_CLASS}
      style={{ gridTemplateColumns: PERMISOS_GRID_COLUMNS }}
    >
      {items.map((item) => (
        <p key={item.label} className={item.align === "center" ? "text-center" : "text-left"}>
          {item.label}
        </p>
      ))}
    </div>
  )
}

export default PermisosTableHeader
