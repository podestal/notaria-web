import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService";
import DomiciliarioTableBody from "./DomiciliarioTableBody"
import DomiciliarioTableHeader from "./DomiciliarioTableHeader"

interface Props {
    domiciliarios: Domiciliario[];
    page: number;
    readyOnly?: boolean;
}


const DomiciliarioTable = ({ domiciliarios, page, readyOnly }: Props) => {
  return (
    <>
        <DomiciliarioTableHeader />
        <DomiciliarioTableBody 
            domiciliarios={domiciliarios}
            page={page}
            readyOnly={readyOnly}
        />
    </>
  )
}

export default DomiciliarioTable