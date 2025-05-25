import KardexErrorsTableBody from "./KardexErrorsTableBody"
import KardexErrorsTableFooter from "./KardexErrorsTableFooter"
import KardexErrorsTableHeader from "./KardexErrorsTableHeader"

const KardexErrorsTable = () => {
  return (
    <div className="bg-slate-50 pt-6 text-black w-full px-6 text-xs">
        <KardexErrorsTableHeader />
        <KardexErrorsTableBody />
        <KardexErrorsTableFooter />
    </div>
  )
}

export default KardexErrorsTable