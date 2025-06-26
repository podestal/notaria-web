import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getTemplateService, {Template} from "../../../services/api/templatesService"

interface Props {
    access: string
    codactos: string
}

const useGetTemplatesByActos = ({ access, codactos }: Props): UseQueryResult<Template[]> => {
    const templateService = getTemplateService({ by_actos: true })
    const params = {codactos}
    return useQuery({
        queryKey: ['templates by actos', codactos],
        queryFn: () => templateService.get(access, params),
        enabled: !!codactos,
    })
}

export default useGetTemplatesByActos