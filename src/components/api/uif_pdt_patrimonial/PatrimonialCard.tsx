import useRetrieveTipoActo from "../../../hooks/api/tipoActo/useRetrieveTipoActo"
import { Patrimonial } from "../../../services/api/patrimonialService"
import useAuthStore from "../../../store/useAuthStore"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    patrimonial: Patrimonial
}

const PatrimonialCard = ({ patrimonial }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: tipoDeActo, isLoading, isError, error, isSuccess } = useRetrieveTipoActo({ access, idtipoacto: patrimonial.idtipoacto })

    if (isLoading) return <p className="text-center text-xs animate-pulse my-6"></p>

    if (isError) return <p className="text-red-500 text-xs">Error: {error.message}</p>

    if (isSuccess)

  return (
    <div className='grid grid-cols-8 gap-4 text-black text-xs p-2 my-2'>
        <p>{patrimonial.itemmp}</p>
        <p>{patrimonial.kardex}</p>
        <p className='col-span-2'>{getTitleCase(tipoDeActo.desacto)}</p>
        <p>{patrimonial.nminuta}</p>
        <p>{getTitleCase(patrimonial.moneda)}</p>
        <p>{patrimonial.importetrans}</p>
        <p>{getTitleCase(patrimonial.exhibiomp)}</p>
    </div>
  )
}

export default PatrimonialCard