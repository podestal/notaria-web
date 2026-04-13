import KardexErrorsHeader from "./KardexErrorsHeader"
import KardexErrorsTable from "./KardexErrorsTable"


const KardexErrors = () => {
  return (
    <div className="w-full flex-col justify-start items-center bg-slate-700 p-1 pt-4 rounded-t-lg text-slate-50 gap-10">
        <div className="w-full flex justify-between items-center px-4">
          <h2 className="text-xl font-bold">Mis Errores En El PDT</h2>
          <div className="flex justify-center items-center gap-8 text-sm">
              <p>Año</p>
              <select className="bg-slate-100 text-slate-700 border border-slate-300 rounded-md p-2">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
              </select>
          </div>
        </div>
        <KardexErrorsHeader />
        <KardexErrorsTable />
    </div>
  )
}

export default KardexErrors