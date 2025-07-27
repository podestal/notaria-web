import { useState } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import useGetPermisosViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useGetPermisosViaje";
import PermisoCard from "./PermisoCard";
import Paginator from "../../../ui/Paginator";

const PermisosTableBody = () => {

    const access = useAuthStore(s => s.access_token) || '';
    const [page, setPage] = useState(1);

    const { data: permisosPage, isLoading, isError, error, isSuccess } = useGetPermisosViaje({ access, page });

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4 py-4">Cargando ...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4 py-4 ">Error: {error.message}</p>;

    if (isSuccess)

  return (
    <>
      <>
        { permisosPage.count > 0 
        ? 
        <>
        {permisosPage.results.map((permiso) => (
          <PermisoCard 
            key={permiso.num_formu} 
            permisoViaje={permiso} 
          />
        ))}
        </>
        : 
        <p className="text-center text-xs my-4 py-4 ">No hay permisos de viaje disponibles</p>}
      </> 
      <Paginator
        page={page}
        setPage={setPage}
        itemsCount={permisosPage.count} 
      />
    </>
  
  )

}

export default PermisosTableBody