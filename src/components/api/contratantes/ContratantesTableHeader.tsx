

const ContratantesTableHeader = () => {
  return (
    <div className="grid grid-cols-9 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4">
        <p className="col-span-2">Contratantes</p>
        <p className="col-span-2">Condición</p>
        <p>Firma</p>
        <p>Fecha Firma</p>
        <p>Responsable</p>
        <p>Dec.Juradas</p>
    </div>
  )
}

export default ContratantesTableHeader