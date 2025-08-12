import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService";
import DomiciliarioTableBody from "./DomiciliarioTableBody"
import DomiciliarioTableHeader from "./DomiciliarioTableHeader"

interface Props {
    domiciliarios: Domiciliario[];
    page: number;
}


const DomiciliarioTable = ({ domiciliarios, page }: Props) => {
  return (
    <>
        <DomiciliarioTableHeader />
        <DomiciliarioTableBody 
            domiciliarios={domiciliarios}
            page={page}
        />
    </>
  )
}

export default DomiciliarioTable