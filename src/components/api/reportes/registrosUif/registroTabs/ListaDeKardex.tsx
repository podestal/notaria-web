import { KardexROValid } from '../../../../../services/api/kardexService'

interface Props {
    kardexErrors: KardexROValid[]
}

const ListaDeKardex = ({
    kardexErrors
}: Props) => {

  return (
    <div>
        <div className="grid grid-cols-7 gap-4 justify-center items-center text-center text-xs font-semibold p-2 my-4 mx-6">
            <p>Kardex</p>
            <p className="col-span-2">Acto</p>
            <p>Tipo de Moneda</p>
            <p>Tipo de Cambio</p>
            <p>Patrimonial</p>
            <p>En Dólares</p>
        </div>
        {kardexErrors?.map((kardex) => (
            <div key={kardex.idkardex}>
                <div className="grid grid-cols-7 gap-4 justify-center items-center text-center text-xs font-semibold p-2 my-4 mx-6">
                    <p>{kardex.kardex}</p>
                </div>
            </div>
        ))}
    </div>
  )
}

export default ListaDeKardex