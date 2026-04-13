const KardexErrorsHeader = () => {
  return (
    <div className="bg-slate-50 mt-6 text-black w-full">
        <p className="px-4 my-2">Tareas Pendientes:</p>
        <div className="w-full grid grid-cols-3 place-items-center gap-2 text-xs mt-4">
            <div className="flex items-center justify-center gap-2">
                <button className="bg-gray-200 px-2 py-1 transition duration-300 text-xs border-1 border-black cursor-pointer hover:bg-gray-300 rounded-md">Copy</button>
                <button className="bg-gray-200 px-2 py-1 transition duration-300 text-xs border-1 border-black cursor-pointer hover:bg-gray-300 rounded-md">Excel</button>
                <button className="bg-gray-200 px-2 py-1 transition duration-300 text-xs border-1 border-black cursor-pointer hover:bg-gray-300 rounded-md">PDF</button>
                <button className="bg-gray-200 px-2 py-1 transition duration-300 text-xs border-1 border-black cursor-pointer hover:bg-gray-300 rounded-md">Print</button>
            </div>
            <div className="flex items-center justify-center gap-2">
                <p>Mostrar:</p>
                <select className="bg-slate-100 text-slate-700 border border-slate-300 rounded-md p-2">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="todo">Todo</option>
                </select>
                <p>Registros</p>
            </div>
            <div className="flex items-center justify-center gap-2">
                <p>Buscar:</p>
                <input type="text" className="bg-slate-100 text-slate-700 border border-slate-300 rounded-md p-1" />
            </div>
        </div>
    </div>
  )
}

export default KardexErrorsHeader