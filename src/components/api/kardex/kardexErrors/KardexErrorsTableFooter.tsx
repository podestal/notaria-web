

const KardexErrorsTableFooter = () => {
  return (
    <div className="w-full flex justify-between items-center py-4">
        <p>Mostrando 0 a 0 de 0 Registros</p>
        <div className="flex items-center justify-center gap-2">
            <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Anterior</button>
            <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Siguiente</button>
        </div>
    </div>
  )
}

export default KardexErrorsTableFooter