import moment from "moment"
import { Documento } from "../../../services/docs/documentosService"

interface Props {
    document: Documento
}

const DigitacionDocumentCard = ({ document }: Props) => {
  return (
    <div
        className="grid grid-cols-14 text-xs text-black p-2 mb-4 place-content-center border-b-2 border-gray-200"
    >
        <p className="col-span-2">Proy</p>
        <p className="col-span-2">{document.kardex}</p>
        <p className="col-span-2">{moment(document.fecha).format('MM/DD/YYYY')}</p>
        <p className="col-span-2">{moment(document.fecha).format('HH:MM:SS')}</p>
        <p className="col-span-2">Usuario</p>
        <p>Proy</p>
        <p>Part</p>
        <p>Test</p>
        <p>Reg</p>
    </div>
  )
}

export default DigitacionDocumentCard