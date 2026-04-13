import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService"
import DomiciliarioCard from "./DomiciliarioCard";

interface Props {
    domiciliarios: Domiciliario[];
    page: number;
    readyOnly?: boolean;
}

const DomiciliarioTableBody = ({ domiciliarios, page, readyOnly }: Props) => {
  return (
    <>
        {domiciliarios.map((domiciliario) => (
            <DomiciliarioCard key={domiciliario.id_domiciliario} domiciliario={domiciliario} readyOnly={readyOnly}  />
        ))}
    </>
  )
}

export default DomiciliarioTableBody