import { useState } from 'react'
import { Contratante } from '../../../services/api/contratantesService'
import ContratantesForm from './ContratantesForm'
import useGetCliente2ByContratante from '../../../hooks/api/cliente2/useGetCliente2ByContratante'
import useAuthStore from '../../../store/useAuthStore'
import useUpdateContratante from '../../../hooks/api/contratantes/useUpdateContratante'
import UpdateCliente2 from '../clientes2/UpdateCliente2'

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    contratante: Contratante
    setCloseUpdateContratante: React.Dispatch<React.SetStateAction<boolean>>
}

const PreUpdateContratantesForm = ({ idtipkar, idtipoacto, kardex, contratante, setCloseUpdateContratante }: Props) => {

    const access = useAuthStore((state) => state.access_token) || ''
    const updateContratante = useUpdateContratante({ kardex, contratanteId: contratante.idcontratante })
    const [showContratanteForm, setShowContratanteForm] = useState(true)
    const [showClienteForm, setShowClienteForm] = useState(false)

    const { data: cliente2, isLoading, isError, error, isSuccess } = useGetCliente2ByContratante({ access, idcontratante: contratante.idcontratante })

    if (isLoading) return <p className="text-md animate-pulse text-center">Cargando ...</p>
    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess)

  return (
    <>
        {showContratanteForm && 
            <ContratantesForm 
                cliente1={null}
                cliente2={cliente2}
                setShowContratanteForm={setShowContratanteForm}
                setShowClienteForm={setShowClienteForm}
                setCloseUpdateContratante={setCloseUpdateContratante}
                setClientesCheck={() => {}}
                idtipoacto={idtipoacto}
                idtipkar={idtipkar}
                kardex={kardex}
                contratante={contratante}
                updateContratante={updateContratante}
            />}
        {showClienteForm &&
        <UpdateCliente2 
            dni={cliente2.numdoc}
            setShowContratanteForm={setShowContratanteForm}
            setShowClienteForm={setShowClienteForm}
            // setCliente1={() => {}}
            cliente2={cliente2}
            kardex={kardex}
        />}
    </>
  )
}

export default PreUpdateContratantesForm