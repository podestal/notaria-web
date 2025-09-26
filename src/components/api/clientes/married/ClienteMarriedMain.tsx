import { Cliente } from "../../../../services/api/cliente1Service"
import ClienteConyugue from "./ClienteConyugue"

type Props = {
    cliente1: Cliente
    setConyuge: React.Dispatch<React.SetStateAction<string>>
}

const ClienteMarriedMain = ({ cliente1, setConyuge }: Props) => {

  return (
    <>
    {
        cliente1.idestcivil === 2 
        &&
        <ClienteConyugue 
            clienteConyuge={cliente1.conyugue_name || ''}
            setConyuge={setConyuge}
        />
        
    }
    </>
  )
}

export default ClienteMarriedMain