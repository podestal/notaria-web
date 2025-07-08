import useGetCargos from "../../../hooks/api/cargos/useGetCargos"
import useUpdateCliente2 from "../../../hooks/api/cliente2/useUpdateCliente2"
import useGetNacionalidades from "../../../hooks/api/nacionalidades/useGetNacionalidades"
import useGetProfesiones from "../../../hooks/api/profesiones/useGetProfesiones"
import useGetUbigeos from "../../../hooks/api/ubigeo/useGetUbigeos"
import { Cliente2 } from "../../../services/api/clienteService"
import Cliente2Form from "./Cliente2Form"

interface Props {
    dni: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    // setCliente1: React.Dispatch<React.SetStateAction<Cliente | null>>
    cliente2: Cliente2
    kardex: string
}

const UpdateCliente2 = ({ 
    dni, 
    setShowContratanteForm, 
    setShowClienteForm, 
    // setCliente1, 
    cliente2,
    kardex,
 }: Props) => {


    const tipoPersona = cliente2.tipper === 'N' ? 1 : 2
    const updateCliente2 = useUpdateCliente2({ clienteId: cliente2.idcontratante, kardex })

    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()
    const { data: profesiones, isLoading: isLoadingProfesiones, isError: isErrorProfesiones, isSuccess: isSuccessProfesiones } = useGetProfesiones()
    const { data: cargos, isLoading: isLoadingCargos, isError: isErrorCargos, isSuccess: isSuccessCargos } = useGetCargos()
    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos()

    if (isNacionalidadesLoading || isLoadingProfesiones || isLoadingCargos || isLoadingUbigeos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorProfesiones || isErrorCargos || isErrorUbigeo) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessProfesiones && isSuccessCargos && isSuccessUbigeo)


  return (
    <Cliente2Form 
        dni={dni}
        setShowContratanteForm={setShowContratanteForm}
        setShowClienteForm={setShowClienteForm}
        setCliente2={() => {}}
        nacionalidades={nacionalidades}
        profesiones={profesiones}
        cargos={cargos}
        ubigeos={ubigeos}
        cliente2={cliente2} 
        updateCliente2={updateCliente2}
        selectedTipoPersona={tipoPersona}
    />
  )
}

export default UpdateCliente2