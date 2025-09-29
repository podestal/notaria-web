import { Cliente } from "../../../../services/api/cliente1Service"
import ClienteConyugue from "./ClienteConyugue"

type Props = {
    cliente1: Cliente
    setConyuge: React.Dispatch<React.SetStateAction<string>>
    setConyugeMarried: React.Dispatch<React.SetStateAction<boolean>>
}

const ClienteMarriedMain = ({ cliente1, setConyuge, setConyugeMarried }: Props) => {

  return (
    <>
        <ClienteConyugue 
            clienteConyuge={cliente1.conyugue_name || ''}
            setConyuge={setConyuge}
            setConyugeMarried={setConyugeMarried}
        />
    </>
  )
}

export default ClienteMarriedMain