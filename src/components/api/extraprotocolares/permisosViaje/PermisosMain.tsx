import { useState } from "react";
import GenericHeader from "../../../ui/GenericHeader"
import PermisosFilter from "./PermisosFilter"
import PermisosTable from "./PermisosTable"
import TopModal from "../../../ui/TopModal";
import CreatePermiso from "./CreatePermiso";

const PermisosMain = () => {

    const [open, setOpen] = useState(false);

  return (
    <>
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Permisos de Viaje"
          setOpen={setOpen}
        />
        <PermisosFilter 
          dateFrom={undefined}
          setDateFrom={() => {}}
          dateTo={undefined}
          setDateTo={() => {}}
        />
        <PermisosTable />
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <CreatePermiso />
      </TopModal>

    </>
  )
}

export default PermisosMain