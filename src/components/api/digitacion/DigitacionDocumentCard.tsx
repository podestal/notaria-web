import moment from "moment"
import { Documento } from "../../../services/docs/documentosService"
import DigitacionGetProyect from "./DigitacionGetProyect"
import DigitactionGetPart from "./DigitactionGetPart"
import DigitacionGetTest from "./DigitacionGetTest"
import DigitacionGetReg from "./DigitacionGetReg"
import { Kardex } from "../../../services/api/kardexService"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import { Logs } from "lucide-react"

interface Props {
    document: Documento
    kardex: Kardex
}

const DigitacionDocumentCard = ({ document, kardex }: Props) => {

  const [open, setOpen] = useState(false)
  return (
    <>
    <div
        className="grid grid-cols-14 text-xs text-black  mb-4 place-content-center border-b-2 border-gray-200 text-center"
    >
        <p className="col-span-2">Proy</p>
        <p className="col-span-2">{document.kardex}</p>
        <p className="col-span-2">{moment(document.fecha).format('MM/DD/YYYY')}</p>
        <p className="col-span-2">{moment(document.fecha).format('HH:MM:SS')}</p>
        <div className="col-span-2 text-center flex justify-center">
        <Logs 
          size={20}
          className="text-blue-500 hover:text-blue-400 cursor-pointer"
          onClick={() => setOpen(true)}
        />
        </div>
        <DigitacionGetProyect 
            kardex={kardex}
        />
        <DigitactionGetPart />
        <DigitacionGetTest />
        <DigitacionGetReg />
    </div>
    <TopModal
      isOpen={open}
      onClose={() => setOpen(false)}
    >
      <p>Logs</p>

    </TopModal>
    </>
  )
}

export default DigitacionDocumentCard