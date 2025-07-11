import { Kardex } from "../../../services/api/kardexService"
import CreateDocumento from "./CreateDocumento"


interface Props {
    kardex: Kardex
}


const DigitacionMutations = ({ kardex }: Props) => {
  return (
    <div className="w-full flex items-center justify-center my-4 gap-12">
        <CreateDocumento 
          kardex={kardex}
        />
        <button className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 text-xs cursor-pointer">Actualizar Proyecto</button>
        <button className="mt-8 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 text-xs cursor-pointer">Generar Parte</button>
        <button className="mt-8 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors duration-300 text-xs cursor-pointer">Generar Testimonio</button>
    </div>
  )
}

export default DigitacionMutations