import GenericHeader from "../../../ui/GenericHeader"
import PermisosFilter from "./PermisosFilter"

const PermisosMain = () => {
  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Permisos de Viaje"
          setOpen={() => {}}
        />
        <PermisosFilter 
          dateFrom={undefined}
          setDateFrom={() => {}}
          dateTo={undefined}
          setDateTo={() => {}}
        />
        {/* Aquí se incluiría la tabla de permisos de viaje */}
    </div>
  )
}

export default PermisosMain