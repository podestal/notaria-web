import { KardexNoEnvian } from "../../../../../services/api/kardexService"

interface Props {
    kardexNoEnvian: KardexNoEnvian[]
}

// KARDEX	ACTO	TIPO DE MONEDA	PATRIMONIAL

const ListaKardexNoEnvian = ({
    kardexNoEnvian
}: Props) => {
  return (
    <div>
        <div className="grid grid-cols-5 text-left gap-4 justify-center items-center text-xs font-semibold p-2 my-4 mx-6">
            <p>Kardex</p>
            <p className="col-span-2">Acto</p>
            <p>Tipo de Moneda</p>
            <p>Patrimonial</p>
        </div>
        {kardexNoEnvian?.map((kardex) => (
            <div key={kardex.idkardex}>
                <div className="grid grid-cols-5 text=left gap-4 justify-center items-center text-xs p-2 my-4 mx-6">
                    <p>{kardex.kardex}</p>
                    <p className="col-span-2">{kardex.act}</p>
                    <p>{kardex.tipo_moneda}</p>
                    <p>S/.{kardex.patrimonial}</p>
                </div>
            </div>
        ))}
    </div>
  )
}

export default ListaKardexNoEnvian