import { KardexRO } from "../../../../../services/api/kardexService"

interface Props {
    kardexRO: KardexRO[]
}

const ListaDeErrores = ({
    kardexRO
}: Props) => {

  return (
    <div>
        <>{console.log(kardexRO)}</>
    </div>
  )
}

export default ListaDeErrores