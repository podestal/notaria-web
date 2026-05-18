const headerItems = [
    "N° Kard - Año",
    "Fec. Ingreso",
    "Actos",
    "Contratantes",
    "Fec. Escrit.",
    "Nº Instr.",
    "Minuta",
    "Folio Ini.",
    "Folio Fin",
    "Registro",
    "Tomo",
    "Usuario",
]

const KardexTableHeader = () => {

  return (
    <div className="grid grid-cols-12 items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-700 via-slate-700 to-slate-800 px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-100 shadow-sm">
      {headerItems.map((item, index) => (
        <p
          key={index}
          className="relative text-center leading-tight after:absolute after:right-[-0.35rem] after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-slate-400/40 last:after:hidden"
        >
          {item}
        </p>
      ))}
    </div>
  )
}

export default KardexTableHeader