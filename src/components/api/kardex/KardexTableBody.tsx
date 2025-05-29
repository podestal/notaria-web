import { Kardex, KardexPage } from "../../../services/api/kardexService"
import KardexCard from "./KardexCard"

interface Props {
    kardexList: KardexPage | Kardex[]
}

const KardexTableBody = ({ kardexList }: Props) => {

  return (
    <>
    <div>
        {Array.isArray(kardexList) && kardexList.map(singleKardex => (
            <KardexCard 
                key={singleKardex.idkardex}
                kardex={singleKardex}
            />
        ))}
    </div>


    </>
  )
}

export default KardexTableBody