import useCreateDomiciliario from "../../../../hooks/api/extraprotocolares/domiciliario/useCreateDomiciliario";
import DomiciliarioForm from "./DomiciliarioForm"

const CreateDomiciliario = () => {

  const createDomiciliario = useCreateDomiciliario();

  return (
    <DomiciliarioForm 
      createDomiciliario={createDomiciliario}
    />
  )
}

export default CreateDomiciliario