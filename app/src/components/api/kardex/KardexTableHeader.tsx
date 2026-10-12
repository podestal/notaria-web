export const KARDEX_GRID_COLUMNS =
    "minmax(104px,1.1fr) minmax(86px,0.85fr) minmax(150px,1.7fr) minmax(170px,2fr) minmax(86px,0.85fr) minmax(64px,0.7fr) minmax(60px,0.65fr) minmax(64px,0.65fr) minmax(64px,0.65fr) minmax(64px,0.7fr) minmax(56px,0.6fr) minmax(120px,1.1fr)"

const headerItems = [
    { label: "N° Kardex", align: "left" },
    { label: "Fec. Ingreso", align: "left" },
    { label: "Actos", align: "left" },
    { label: "Contratantes", align: "left" },
    { label: "Fec. Escrit.", align: "left" },
    { label: "Nº Instr.", align: "center" },
    { label: "Minuta", align: "center" },
    { label: "Folio Ini.", align: "center" },
    { label: "Folio Fin", align: "center" },
    { label: "Registro", align: "center" },
    { label: "Tomo", align: "center" },
    { label: "Usuario", align: "left" },
]

const KardexTableHeader = () => {

  return (
    <div
      className="sticky top-0 z-10 grid items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur"
      style={{ gridTemplateColumns: KARDEX_GRID_COLUMNS }}
    >
      {headerItems.map((item) => (
        <p key={item.label} className={item.align === "center" ? "text-center" : "text-left"}>
          {item.label}
        </p>
      ))}
    </div>
  )
}

export default KardexTableHeader
