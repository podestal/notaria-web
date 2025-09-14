import { BrushCleaning } from "lucide-react"
import SingleSelect from "../../../ui/SingleSelect"

// type Option = {
//     value: string;
//     label: string;
//   };
  
//   interface SingleSelectProps {
//       options: Option[];
//       selected: string;
//       onChange: (value: string) => void;
//       disabled?: boolean;
//   }

const ParticipaRentaForm = () => {
  return (
    <div>
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Datos de la Renta</h2>
            <div className="flex items-center justify-center gap-2">
                <BrushCleaning className="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-pointer transition-all duration-300" />
                <p className="text-sm text-gray-900 hover:text-gray-500 cursor-pointer transition-all duration-300 font-bold">Limpiar Preguntas</p>
            </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 my-6">
            <p className="font-semibold mb-4">Presentó Comunicación con Cáracter de DECLARACIÓN JURADA indicando:</p>
            <div className="flex flex-col items-start justify-center gap-2">
                <div>
                    <p>¿La enajenación generó renta de 3ra Categoría?</p>
                    {/* <SingleSelect /> */}
                </div>
                <div>
                    <p>¿El bien enajenado era la casa habitación del enajenante?</p>
                </div>
                <div>
                    <p>¿El impuesto por pagar es cero?</p>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-start my-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-all duration-300">Grabar</button>
        </div>
    </div>
  )
}

export default ParticipaRentaForm