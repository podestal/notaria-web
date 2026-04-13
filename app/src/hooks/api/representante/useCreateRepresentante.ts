import { useMutation, UseMutationResult } from "@tanstack/react-query"
import getRepresentantesService, { Representante, CreateUpdateRepresentante } from "../../../services/api/representantesService"

export interface CreateRepresentanteData {
    access: string
    representante: CreateUpdateRepresentante
}

const useCreateRepresentante = (): UseMutationResult<Representante, Error, CreateRepresentanteData> => {
    const representantesService = getRepresentantesService({  })

    return useMutation({
        mutationFn: (data: CreateRepresentanteData) => representantesService.post(data.representante, data.access),
        onSuccess: (data) => {
            console.log("Representante created successfully:", data)
        },
        onError: (error) => {
            console.error("Error creating representante:", error)
        },
    })
}
export default useCreateRepresentante