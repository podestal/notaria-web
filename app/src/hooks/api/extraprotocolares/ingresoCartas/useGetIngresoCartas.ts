import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getIngresoCartasService, {IngresoCartasPage} from "../../../../services/api/extraprotocolares/ingresoCartas"
import moment from "moment"

interface Props {
    access: string
    page: number
    numCarta?: string
    remitente?: string
    destinatario?: string
    dateFrom?: Date
    dateTo?: Date
    dateType?: string // '1' for fecha_ingreso, '2' for fecha
    dissabled?: boolean
}

const useGetIngresoCartas = ({ access, page, numCarta, remitente, destinatario, dateFrom, dateTo, dateType, dissabled }: Props): UseQueryResult<IngresoCartasPage, Error> => {
    const ingresoCartasService = getIngresoCartasService();
    console.log('dateFrom', dateFrom);
    console.log('dateTo', dateTo);
    console.log('page', page);
    
    let params: { page: string; numCarta?: string; remitente?: string; destinatario?: string; dateFrom?: string; dateTo?: string; dateType?: string } = { page: page.toString() };
    if (numCarta) params = { ...params, numCarta };
    if (remitente) params = { ...params, remitente };
    if (destinatario) params = { ...params, destinatario };
    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('DD/MM/YYYY') };
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('DD/MM/YYYY') };
    if (dateType === '2') {
        params = { ...params, dateType: 'fecha_diligencia' }
    } else {
        params = { ...params, dateType: 'fecha_ingreso' }
    }

    console.log('params', params);

    return useQuery({
        queryKey: ['ingreso_cartas', page],
        queryFn: () => ingresoCartasService.get(access, params),
        enabled: !dissabled
    });
}

export default useGetIngresoCartas;