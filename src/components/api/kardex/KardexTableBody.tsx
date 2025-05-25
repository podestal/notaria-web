import { Kardex, KardexPage } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    kardexList: KardexPage | Kardex[]
}

const KardexTableBody = ({ kardexList }: Props) => {

  return (
    <div>
        {Array.isArray(kardexList) && kardexList.map(singleKardex => (
            <div 
                key={singleKardex.idkardex}
                className="grid grid-cols-13 text-[10px] text-center my-4 gap-2"
            >
                <h2 className="text-blue-600 hover:text-blue-400 cursor-pointer">{singleKardex.kardex}</h2>
                <p>{singleKardex.fechaingreso}</p>
                <p>{singleKardex.contrato}</p>
                <p>{getTitleCase(singleKardex.cliente)}</p>
                <p>{singleKardex.fechaescritura}</p>
                <p>{singleKardex.numinstrmento}</p>
                <p>{singleKardex.numminuta}</p>
                <p>{singleKardex.folioini}</p>
                <p>{singleKardex.foliofin}</p>
                <p>{singleKardex.numinstrmento}</p>
                <p>{singleKardex.txa_minuta}</p>
                <p>{getTitleCase(singleKardex.usuario)}</p>
                <p>Escaneo ...</p>
            </div>
        ))}
    </div>
  )
}

export default KardexTableBody