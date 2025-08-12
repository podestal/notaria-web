import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService"
import DomiciliarioCard from "./DomiciliarioCard";

interface Props {
    domiciliarios: Domiciliario[];
    page: number;
}

const DomiciliarioTableBody = ({ domiciliarios, page }: Props) => {
  return (
    <>
        {domiciliarios.map((domiciliario) => (
            <DomiciliarioCard key={domiciliario.id_domiciliario} domiciliario={domiciliario} />
        ))}
    </>
  )
}

export default DomiciliarioTableBody