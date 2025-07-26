import { useState } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import useGetPermisosViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useGetPermisosViaje";

const PermisosTableBody = () => {

    const access = useAuthStore(s => s.access_token) || '';
    const [page, setPage] = useState(1);

    const { data: permisosPage, isLoading, isError, error, isSuccess } = useGetPermisosViaje({ access, page });

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>;

    if (isSuccess)

  return (
    <div>
        <>{console.log(permisosPage)}</>
    </div>
  )
}

export default PermisosTableBody