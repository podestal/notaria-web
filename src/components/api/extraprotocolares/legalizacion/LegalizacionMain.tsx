import GenericHeader from "../../../ui/GenericHeader"
import LegalizacionTable from "./LegalizacionTable"


const LegalizacionMain = () => {
  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Legalización de Firmas"
          setOpen={() => {}}
        />
        <p>Filters</p>
        <LegalizacionTable />
    </div>
  )
}

export default LegalizacionMain