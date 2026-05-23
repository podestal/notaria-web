import { KardexROValid } from '../../../../../services/api/kardexService'
import { formatUifPatrimonial } from '../../../../../utils/uifCurrencyFormat'

interface Props {
    kardexErrors: KardexROValid[]
}

const ListaDeKardex = ({ kardexErrors }: Props) => {
  return (
    <div>
        <div className="grid grid-cols-5 gap-4 justify-center items-center text-center text-xs font-semibold p-2 my-4 mx-6">
            <p>Kardex</p>
            <p className="col-span-2">Acto</p>
            <p>Tipo de Moneda</p>
            <p>Patrimonial</p>
        </div>
        {kardexErrors?.map((kardex) => (
            <div key={kardex.idkardex}>
                <div className="grid grid-cols-5 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6">
                    <p>{kardex.kardex}</p>
                    <p className="col-span-2">{kardex.act}</p>
                    <p>{kardex.tipo_moneda}</p>
                    <p>
                        {formatUifPatrimonial({
                            patrimonial: kardex.patrimonial,
                            tipo_moneda: kardex.tipo_moneda,
                            currency_symbol: kardex.currency_symbol,
                        })}
                    </p>
                </div>
            </div>
        ))}
    </div>
  )
}

export default ListaDeKardex
