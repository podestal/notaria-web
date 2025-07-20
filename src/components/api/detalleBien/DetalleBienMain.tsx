import useGetDetalleBienesByKardex from "../../../hooks/api/detalleBien/useGetDetalleBienesByKardex"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
  kardex: string
}

const DetalleBienMain = ({kardex }: Props) => {

  const access = useAuthStore(s => s.access_token) || ''
  const { data: detalleBienes } = useGetDetalleBienesByKardex({ access, kardex })

  return (
    <div>
      <p>detalle bienes</p>
      <>{console.log("detalleBienes", detalleBienes)}</>
    </div>
  )
}

export default DetalleBienMain