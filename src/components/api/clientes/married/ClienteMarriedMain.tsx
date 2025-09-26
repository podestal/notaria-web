import { useState } from "react"
import { Cliente } from "../../../../services/api/cliente1Service"
import ClienteConyugeLooker from "./ClienteConyugeLooker"
import ClienteConyugue from "./ClienteConyugue"

type Props = {
    cliente1: Cliente
}

const ClienteMarriedMain = ({ cliente1 }: Props) => {

    const [document, setDocument] = useState('')

  return (
    <>
    {
        cliente1.idestcivil === 2 
        ? 
        <ClienteConyugue 
            clienteId={cliente1.conyuge || ''}
        />
        : 
        <ClienteConyugeLooker document={document} setDocument={setDocument} />
    }
    </>
  )
}

export default ClienteMarriedMain