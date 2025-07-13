import moment from "moment"
import { Documento } from "../../../services/docs/documentosService"
import DigitacionGetProyect from "./DigitacionGetProyect"
import DigitactionGetPart from "./DigitactionGetPart"
import DigitacionGetTest from "./DigitacionGetTest"
import DigitacionGetReg from "./DigitacionGetReg"
import { Kardex } from "../../../services/api/kardexService"

interface Props {
    document: Documento
    kardex: Kardex
}

const DigitacionDocumentCard = ({ document, kardex }: Props) => {
  return (
    <div
        className="grid grid-cols-14 text-xs text-black  mb-4 place-content-center border-b-2 border-gray-200 text-center"
    >
        <p className="col-span-2">Proy</p>
        <p className="col-span-2">{document.kardex}</p>
        <p className="col-span-2">{moment(document.fecha).format('MM/DD/YYYY')}</p>
        <p className="col-span-2">{moment(document.fecha).format('HH:MM:SS')}</p>
        <p className="col-span-2">Usuario</p>
        <DigitacionGetProyect 
            kardex={kardex}
        />
        <DigitactionGetPart />
        <DigitacionGetTest />
        <DigitacionGetReg />
    </div>
  )
}

export default DigitacionDocumentCard