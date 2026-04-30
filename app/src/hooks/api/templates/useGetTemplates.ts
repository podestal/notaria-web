import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { TemplatePage, getTemplatePageService } from "../../../services/api/templatesService"

interface Props {
    access: string
    codeActs: string
    fkType: string
    nameTemplate: string
    page: number
}

const useGetTemplates = ({ access, codeActs, fkType, nameTemplate, page }: Props): UseQueryResult<TemplatePage, Error> => {
    const templateService = getTemplatePageService()
    const params = { codeActs, fktypekardex: fkType, nameTemplate, page: page.toString() }
    return useQuery({
        queryKey: ['templates', codeActs, fkType, nameTemplate, page],
        queryFn: () => templateService.get(access, params),
    })
}

export default useGetTemplates