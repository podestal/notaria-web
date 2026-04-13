import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getPermisoViajeService, {PermisoViajePage} from "../../../../services/api/extraprotocolares/permisoViajeService"
import moment from "moment";

interface Props {
    access: string;
    page: number
    crono?: string;
    tipoPermiso?: string;
    nombreParticipante?: string;
    numeroControl?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

const useGetPermisosViaje = ({ access, page, crono, tipoPermiso, nombreParticipante, numeroControl, dateFrom, dateTo }: Props): UseQueryResult<PermisoViajePage, Error> => {
    const permisoViajeService = getPermisoViajeService();
    let params: Record<string, string> = {
        page: page.toString(),
    };

    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('YYYY-MM-DD') }
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('YYYY-MM-DD') }
    if (crono) params = { ...params, crono };
    if (tipoPermiso) params = { ...params, tipoPermiso };
    if (nombreParticipante) params = { ...params, nombreParticipante };
    if (numeroControl) params = { ...params, numeroControl };
    
    return useQuery({
        queryKey: ['permisosViaje', page],
        queryFn: () => permisoViajeService.get(access, params),
        
    });
}
    
export default useGetPermisosViaje;