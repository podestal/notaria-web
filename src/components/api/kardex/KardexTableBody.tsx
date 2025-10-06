import { Kardex, KardexPage } from "../../../services/api/kardexService"
import KardexCard from "./KardexCard"

interface Props {
    kardexList: KardexPage | Kardex[]
    readyOnly?: boolean
}

const KardexTableBody = ({ kardexList, readyOnly }: Props) => {

  return (
    <>
    <div>
        {Array.isArray(kardexList) && kardexList.map(singleKardex => (
            <KardexCard 
                key={singleKardex.idkardex}
                kardex={singleKardex}
                readyOnly={readyOnly}
            />
        ))}
    </div>


    </>
  )
}

export default KardexTableBody