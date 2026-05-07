import { UseMutationResult } from "@tanstack/react-query";
import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService"
import DomiciliarioForm from "./DomiciliarioForm";
import { UpdateDomiciliarioData } from "../../../../hooks/api/extraprotocolares/domiciliario/useUpdateDomiciliario";

interface Props {
    domiciliario: Domiciliario;
    updateDomiciliario: UseMutationResult<Domiciliario, Error, UpdateDomiciliarioData>;
    onRequestCloseForm?: () => void;
}

const UpdateDomiciliario = ({ domiciliario, updateDomiciliario, onRequestCloseForm }: Props) => {
  return (
    <DomiciliarioForm 
        domiciliario={domiciliario}
        updateDomiciliario={updateDomiciliario}
        onRequestCloseForm={onRequestCloseForm}
    />
  )
}

export default UpdateDomiciliario