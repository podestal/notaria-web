import { Predio } from "../../../services/api/prediosService"

interface Props {
    predio: Predio
}

const PrediosCard = ({ predio }: Props) => {
  return (
    <div className="grid grid-cols-11 gap-4 text-xs text-center items-center my-1">
        <p>{predio.tipo}</p>
        <p className="col-span-2">{predio.zona}</p>
        <p className="col-span-2">{predio.denominacion}</p>
        <p>{predio.tipo_via}</p>
        <p className="col-span-2">{predio.nombre_via}</p>
        <p>{predio.numero}</p>
        <p>{predio.manzana}</p>
        <p>{predio.lote}</p>
    </div>
  )
}

export default PrediosCard