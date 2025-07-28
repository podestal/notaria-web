import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getPermisoViajeService, {PermisoViajePage} from "../../../../services/api/extraprotocolares/permisoViajeService"

interface Props {
    access: string;
    page: number
}

const useGetPermisosViaje = ({ access, page }: Props): UseQueryResult<PermisoViajePage, Error> => {
    const permisoViajeService = getPermisoViajeService();
    const params = {
        page: page.toString(),
    };

    return useQuery({
        queryKey: ['permisosViaje', page],
        queryFn: () => permisoViajeService.get(access, params),
    });
}

export default useGetPermisosViaje;