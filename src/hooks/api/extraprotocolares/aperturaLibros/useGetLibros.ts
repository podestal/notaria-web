import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getLibrosService, {LibrosPage} from "../../../../services/api/extraprotocolares/librosService"

interface Props {
    access: string
    page: number
    cliente?: string
    numDoc?: string
    cronologico?: string
    dateFrom?: Date
    dateTo?: Date
}

const   useGetLibros = ({ access, page, cliente, numDoc, cronologico, dateFrom, dateTo }: Props): UseQueryResult<LibrosPage, Error> => {
    const librosService = getLibrosService();
    let params: { page: string; empresa?: string; document?: string; year?: string; num_libro?: string; dateFrom?: string; dateTo?: string } = { page: page.toString() };
    if (cliente) params = { ...params, empresa: cliente };
    if (numDoc) params = { ...params, document: numDoc };
    if (cronologico) {
        let [numLibro, year] = cronologico.split('-');
        params = { ...params, num_libro: numLibro, year };
    }
    
    if (dateFrom) params = { ...params, dateFrom: dateFrom.toISOString().split('T')[0] };
    if (dateTo) params = { ...params, dateTo: dateTo.toISOString().split('T')[0] }; 

    return useQuery({
        queryKey: ['libros', page],
        queryFn: () => librosService.get(access, params),
    });
}

export default useGetLibros;