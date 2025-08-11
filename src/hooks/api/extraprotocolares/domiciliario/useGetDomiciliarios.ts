import { UseQueryResult, useQuery } from "@tanstack/react-query";
import getDomiciliarioService, { DomiciliarioPage } from "../../../../services/api/extraprotocolares/domiciliarioService";
import moment from "moment";

interface Props {
    dateFrom?: Date;
    dateTo?: Date;
    crono?: string;
    solicitante?: string;
    access: string;
    page: number;
}

const useGetDomiciliarios = ({ dateFrom, dateTo, crono, solicitante, access, page }: Props): UseQueryResult<DomiciliarioPage, Error> => {

    const domiciliarioService = getDomiciliarioService();
    let params: Record<string, string> = {
        page: page.toString(),
    };

    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('YYYY-MM-DD') }
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('YYYY-MM-DD') }
    if (crono) params = { ...params, crono };
    if (solicitante) params = { ...params, solicitante };
    
    return useQuery<DomiciliarioPage, Error>({
        queryKey: ['domiciliarios', page],
        queryFn: () => domiciliarioService.get(access, params),
    })
}

export default useGetDomiciliarios;