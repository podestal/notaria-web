import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService"
import DomiciliarioForm from "./DomiciliarioForm";

interface Props {
    domiciliario: Domiciliario;
}

const UpdateDomiciliario = ({ domiciliario }: Props) => {
  return (
    <DomiciliarioForm 
        domiciliario={domiciliario}
    />
  )
}

export default UpdateDomiciliario