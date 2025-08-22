

const RegistroUifSummary = () => {
  return (
    <>
    <h2 className="text-lg text-left font-semibold my-4 mx-6">Resumen de Operaciones UIF</h2>
    <div className="w-full text-sm grid grid-cols-5 gap-4 justify-center items-center text-center my-6 px-8 py-4 mx-6">
        <div className="flex flex-col justify-center items-start font-semibold gap-2">
            <h2>Mes</h2>
            <h2>Fecha</h2>
            <h2>Cantidad de Kardex</h2>
            <h2>Archivo Plano</h2>
            <h2>Archivo Excel</h2>
        </div>
        <div className="col-span-4 flex flex-col justify-center items-start gap-2">
            <h2>-</h2>
            <h2>-</h2>
            <h2>-</h2>
            <h2>-</h2>
            <h2>-</h2>
        </div>
    </div>
    </>
  )
}

export default RegistroUifSummary