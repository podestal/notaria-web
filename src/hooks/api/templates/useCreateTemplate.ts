import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getTemplateService, { Template } from "../../../services/api/templatesService"

export interface CreateTemplateData {
    access: string
    nametemplate: string
    fktypekardex: number
    codeacts: string
    contract: string
    document: File
}

const useCreateTemplate = (): UseMutationResult<Template, Error, CreateTemplateData> => {
    const queryClient = useQueryClient()
    const templateService = getTemplateService({})

    return useMutation({
        mutationFn: ({ access, nametemplate, fktypekardex, codeacts, contract, document }: CreateTemplateData) => {
            const formData = new FormData()
            formData.append('nametemplate', nametemplate)
            formData.append('fktypekardex', fktypekardex.toString())
            formData.append('codeacts', codeacts)
            formData.append('contract', contract)
            formData.append('document', document)
            return templateService.post(formData as any, access)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] })
        },
        onError: (error) => {
            console.error('Error creating template:', error)
        },
    })
}

export default useCreateTemplate
