import { Kardex } from "../../../services/api/kardexService"
import CreateDocumento from "./CreateDocumento"
import UpdateDocumento from "./UpdateDocumento"


interface Props {
    kardex: Kardex
    enableCreate: boolean
}


const DigitacionMutations = ({ kardex, enableCreate }: Props) => {

  return (
    <div className="w-full flex items-center justify-center mb-6 gap-12">
        {/* {enableCreate && >} */}
        <CreateDocumento 
          kardex={kardex}
        />
        <UpdateDocumento 
          kardex={kardex}
        />
        <button className="mt-8 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 text-xs cursor-pointer">Generar Parte</button>
        <button className="mt-8 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors duration-300 text-xs cursor-pointer">Generar Testimonio</button>
    </div>
  )
}

export default DigitacionMutations