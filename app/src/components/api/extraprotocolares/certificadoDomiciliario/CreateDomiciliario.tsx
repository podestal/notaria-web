import useCreateDomiciliario from "../../../../hooks/api/extraprotocolares/domiciliario/useCreateDomiciliario";
import DomiciliarioForm from "./DomiciliarioForm"

interface Props {
  onRequestCloseForm?: () => void
}

const CreateDomiciliario = ({ onRequestCloseForm }: Props) => {

  const createDomiciliario = useCreateDomiciliario();

  return (
    <DomiciliarioForm 
      createDomiciliario={createDomiciliario}
      onRequestCloseForm={onRequestCloseForm}
    />
  )
}

export default CreateDomiciliario