import { useState } from "react";
import GenericHeader from "../../../ui/GenericHeader"
import PermisosFilter from "./PermisosFilter"
import PermisosTable from "./PermisosTable"
import TopModal from "../../../ui/TopModal";
import CreatePermiso from "./CreatePermiso";
import useGetPermisosViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useGetPermisosViaje";
import useAuthStore from "../../../../store/useAuthStore";
import Paginator from "../../../ui/Paginator";


const PermisosMain = () => {

    const access = useAuthStore(s => s.access_token) || '';
    const [open, setOpen] = useState(false);
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [page, setPage] = useState(1);

    const { data: permisosPage, isLoading, isError, error, isSuccess, refetch } = useGetPermisosViaje({ access, page });

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4 py-4">Cargando ...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4 py-4 ">Error: {error.message}</p>;

    if (isSuccess)

  return (
    <>
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Permisos de Viaje"
          setOpen={setOpen}
        />
        <PermisosFilter 
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />
        <PermisosTable 
          permisosPage={permisosPage}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={permisosPage.count} 
        />
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