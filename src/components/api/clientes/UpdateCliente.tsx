import useGetCargos from "../../../hooks/api/cargos/useGetCargos"
import useGetNacionalidades from "../../../hooks/api/nacionalidades/useGetNacionalidades"
import useGetProfesiones from "../../../hooks/api/profesiones/useGetProfesiones"
import useGetUbigeos from "../../../hooks/api/ubigeo/useGetUbigeos"
import { Cliente } from "../../../services/api/cliente1Service"
import ClientesForm from "./ClientesForm"

interface Props {
    dni: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    setCliente1: React.Dispatch<React.SetStateAction<Cliente | null>>
    cliente1: Cliente | null
}

const UpdateCliente = ({ 
    dni, 
    setShowContratanteForm, 
    setShowClienteForm, 
    setCliente1, 
    cliente1
 }: Props) => {

    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()
    const { data: profesiones, isLoading: isLoadingProfesiones, isError: isErrorProfesiones, isSuccess: isSuccessProfesiones } = useGetProfesiones()
    const { data: cargos, isLoading: isLoadingCargos, isError: isErrorCargos, isSuccess: isSuccessCargos } = useGetCargos()
    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos()

    if (isNacionalidadesLoading || isLoadingProfesiones || isLoadingCargos || isLoadingUbigeos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorProfesiones || isErrorCargos || isErrorUbigeo) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessProfesiones && isSuccessCargos && isSuccessUbigeo)

  return (
    <ClientesForm 
        dni={dni}
        setShowContratanteForm={setShowContratanteForm}
        setShowClienteForm={setShowClienteForm}
        setCliente1={setCliente1}
        nacionalidades={nacionalidades}
        profesiones={profesiones}
        cargos={cargos}
        ubigeos={ubigeos}
        cliente1={cliente1} 
    />
  )
}

export default UpdateCliente