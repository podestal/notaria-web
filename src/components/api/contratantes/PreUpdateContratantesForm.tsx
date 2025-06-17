import { useState } from 'react'
import { Contratante } from '../../../services/api/contratantesService'
import ContratantesForm from './ContratantesForm'
import useGetCliente2ByContratante from '../../../hooks/api/cliente2/useGetCliente2ByContratante'
import useAuthStore from '../../../store/useAuthStore'

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    contratante: Contratante
}

const PreUpdateContratantesForm = ({ idtipkar, idtipoacto, kardex, contratante }: Props) => {

    const access = useAuthStore((state) => state.access_token) || ''
    const [showContratanteForm, setShowContratanteForm] = useState(true)
    const [showClienteForm, setShowClienteForm] = useState(false)

    const { data: cliente2, isLoading, isError, error, isSuccess } = useGetCliente2ByContratante({ access, idcontratante: contratante.idcontratante })

    if (isLoading) return <p className="text-md animate-pulse text-center">Cargando ...</p>
    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess)

  return (
    <>
        <>{console.log('cliente2', cliente2)}</>
        {showContratanteForm && 
            <ContratantesForm 
                cliente1={cliente2}
                setShowContratanteForm={setShowContratanteForm}
                setShowClienteForm={setShowClienteForm}
                setClientesCheck={() => {}}
                idtipoacto={idtipoacto}
                idtipkar={idtipkar}
                kardex={kardex}
                contratante={contratante}
            />}
        {showClienteForm &&
        <div>
            <p>Cliente updated</p>    
            <button 
                onClick={() => {
                    setShowContratanteForm(true)
                    setShowClienteForm(false)
                }}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
            >
                Click</button>
        </div>}
    </>
  )
}

export default PreUpdateContratantesForm