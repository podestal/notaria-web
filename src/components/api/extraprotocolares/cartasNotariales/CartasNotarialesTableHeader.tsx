
const CartasNotarialesTableHeader = () => {

  return (
    <div className="grid grid-cols-7 gap-4 justify-center items-center text-center bg-slate-200 text-black text-xs font-semibold p-2 my-4 mx-6">
        <div>Nro Carta</div>
        <div>Fecha Ingreso</div>
        <div>Fecha Diligencia</div>
        <div className="col-span-2">Remitente</div>
        <div className="col-span-2">Destinatario</div>
    </div>
  )
}

export default CartasNotarialesTableHeader