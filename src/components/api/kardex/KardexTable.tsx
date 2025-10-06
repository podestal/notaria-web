import KardexTableBody from "./KardexTableBody"
import KardexTableFooter from "./KardexTableFooter"
import KardexTableHeader from "./KardexTableHeader"
import { KardexPage } from "../../../services/api/kardexService"

interface Props {
    kardexPage: KardexPage
    setPage: React.Dispatch<React.SetStateAction<number>>
    page: number
    readyOnly?: boolean
}

const KardexTable = ({ kardexPage, setPage, page, readyOnly }: Props) => {


  return (
    <div>
        <div className="px-2">
          <KardexTableHeader />
          <KardexTableBody 
              kardexList={kardexPage.results }
              readyOnly={readyOnly}
          />
          <KardexTableFooter 
              page={page}
              setPage={setPage}
              kardexCount={kardexPage.count}
          />
        </div>
    </div>
  )
}

export default KardexTable