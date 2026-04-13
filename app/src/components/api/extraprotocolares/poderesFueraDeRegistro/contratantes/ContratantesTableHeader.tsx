

const ContratantesTableHeader = () => {

    // No	Codigo	Nombre	Firma	Condicion
  return (
    <div className="grid grid-cols-8 gap-4 justify-center items-center text-center bg-slate-100 text-black text-xs font-semibold p-2 my-4 mx-6">
        <p>No</p>
        <p>Codigo</p>
        <p className="col-span-2">Nombre</p>
        <p>Firma</p>
        <p className="col-span-2">Condicion</p>
        <div className="flex justify-center items-center gap-4 text-xs">

        </div>
    </div>
  )
}

export default ContratantesTableHeader