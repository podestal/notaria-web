import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import KardexErrors from "./kardexErrors/KardexErrors"
import KardexFilters from "./KardexFilters"
import KardexHeader from "./KardexHeader"
import KardexTable from "./KardexTable"

const KardexMain = () => {

  const bodyRender = useBodyRenderStore(s => s.bodyRender)

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        {bodyRender !== 0 
        ?
        <>
          <KardexHeader />
          {/* <KardexList /> */}
          <KardexFilters 

          />
          <KardexTable 

          />
        </>
        :
        <KardexErrors />}
    </div>
  )
}

export default KardexMain