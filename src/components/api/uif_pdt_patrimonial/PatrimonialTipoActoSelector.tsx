import useGetTipoActo from "../../../hooks/api/tipoActo/useGetTipoActo"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"

interface Props {
    idtipkar: number
    kardexActos: string[]
    selectedTipoDeActo: string
    setSelectedTipoDeActo: React.Dispatch<React.SetStateAction<string>>
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>
}

const PatrimonialTipoActoSelector = ({ idtipkar, kardexActos, error, setError, selectedTipoDeActo, setSelectedTipoDeActo }: Props) => {

    const { data: tiposActo, isLoading, isError, error: tipoActoError, isSuccess } = useGetTipoActo()

    if (isLoading) return <p>Cargando tipos de acto...</p>
    if (isError) return <p>Error al cargar tipos de acto: {tipoActoError.message}</p>


    if (isSuccess)

  return (
    <SimpleSelectorStr 
        options={[{ value: '', label: 'Seleccione'}, ...tiposActo
            .filter( tipoActo => tipoActo.idtipkar === idtipkar)
            .filter(tipoActo => kardexActos.includes(tipoActo.idtipoacto.toString()))
            .map(tipoActo => ({
                value: tipoActo.idtipoacto,
                label: tipoActo.desacto
            }))]}
        defaultValue={selectedTipoDeActo}
        setter={setSelectedTipoDeActo}
        label="Tipo de Acto"
        error={error}
        setError={setError}
        required
    />
  )
}

export default PatrimonialTipoActoSelector