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
    "Escaneo"
]

const KardexTableHeader = () => {

  return (
    <div className="grid grid-cols-13 bg-neutral-500 text-center text-xs h-10 place-items-center text-slate-50 font-semibold gap-2">
        {headerItems.map((item, index) => (
            <p key={index} className="text-center">
                {item}
            </p>
        ))}
    </div>
  )
}

export default KardexTableHeader