const PoderesFueraDeRegistroTableHeader = () => {
  return (
    <div className="grid grid-cols-8 gap-4 justify-center items-center text-center bg-slate-200 text-black text-xs font-semibold p-2 my-4 mx-6">
        <div>Nro Control</div>
        <div>Cronológico</div>
        <div className="col-span-2">Tipo de Poder</div>
        <div>Fec. Crono</div>
        <div className="col-span-2">Contratantes</div>
        <div>Fec. Ingreso</div>
    </div>
  )
}

export default PoderesFueraDeRegistroTableHeader