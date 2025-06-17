import ContratantesForm from "./ContratantesForm"
import { Cliente } from "../../../services/api/cliente1Service"
import useCreateContratante from "../../../hooks/api/contratantes/useCreateContratantes"

interface Props {
    cliente1: Cliente | null
    idtipoacto: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    setClientesCheck: React.Dispatch<React.SetStateAction<boolean>>
    idtipkar: number
    kardex: string
}


const CreateContratante = ({ 
    cliente1,
    idtipoacto,
    setShowContratanteForm,
    setShowClienteForm,
    setClientesCheck,
    idtipkar,
    kardex
}: Props) => {

    const createContratante = useCreateContratante({ kardex, idcliente: cliente1?.idcliente || '' })

  return (
    <ContratantesForm 
        cliente1={cliente1}
        cliente2={null}
        setShowContratanteForm={setShowContratanteForm}
        setShowClienteForm={setShowClienteForm}
        idtipoacto={idtipoacto}
        createContratante={createContratante}
        idtipkar={idtipkar}
        kardex={kardex}
        setClientesCheck={setClientesCheck}
    />
  )
}

export default CreateContratante