import { useMemo, useState } from 'react'
import { Contratante } from '../../../services/api/contratantesService'
import ContratantesForm from './ContratantesForm'
import useGetCliente2ByContratante from '../../../hooks/api/cliente2/useGetCliente2ByContratante'
import useGetContratanteById from '../../../hooks/api/contratantes/useGetContratanteById'
import useAuthStore from '../../../store/useAuthStore'
import useUpdateContratante from '../../../hooks/api/contratantes/useUpdateContratante'
import UpdateCliente2 from '../clientes2/UpdateCliente2'

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    idkardex?: number
    contratante: Contratante
    setCloseUpdateContratante: React.Dispatch<React.SetStateAction<boolean>>
    onRegisterCloseGuard?: (guard: () => boolean) => void
}

const PreUpdateContratantesForm = ({
    idtipkar,
    idtipoacto,
    kardex,
    idkardex,
    contratante,
    setCloseUpdateContratante,
    onRegisterCloseGuard,
}: Props) => {

    const access = useAuthStore((state) => state.access_token) || ''
    const updateContratante = useUpdateContratante({
        kardex,
        contratanteId: contratante.idcontratante,
        idkardex,
    })
    const [showContratanteForm, setShowContratanteForm] = useState(true)
    const [showClienteForm, setShowClienteForm] = useState(false)

    const {
        data: contratanteDetail,
        isLoading: isLoadingContratante,
        isError: isContratanteError,
        error: contratanteError,
    } = useGetContratanteById({ contratanteId: contratante.idcontratante })

    const { data: cliente2, isLoading: isLoadingCliente, isError: isClienteError, error: clienteError } =
        useGetCliente2ByContratante({ access, idcontratante: contratante.idcontratante })

    const contratanteForForm = useMemo<Contratante>(
        () => (contratanteDetail ? { ...contratante, ...contratanteDetail } : contratante),
        [contratante, contratanteDetail]
    )

    if (isLoadingContratante || isLoadingCliente) {
        return <p className="text-md animate-pulse text-center">Cargando ...</p>
    }
    if (isContratanteError) {
        return <p className="text-md text-red-500 text-center">Error: {contratanteError.message}</p>
    }
    if (isClienteError) {
        return <p className="text-md text-red-500 text-center">Error: {clienteError.message}</p>
    }
    if (!cliente2) return null

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
                contratante={contratanteForForm}
                updateContratante={updateContratante}
                selectedTipoPersona={cliente2.tipper === 'N' ? 1 : 2}
                onRegisterCloseGuard={onRegisterCloseGuard}
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