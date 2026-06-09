import { useMutation } from "@tanstack/react-query"
import personasService, { type Persona } from "../../../services/taxes/personasService"

interface LookupData {
    access: string
    numero_documento: string
}

const useLookupPersonaByDocumento = () => {
    return useMutation<Persona | null, Error, LookupData>({
        mutationFn: async ({ access, numero_documento }) => {
            const trimmed = numero_documento.trim()
            if (!trimmed) return null

            const data = await personasService.get(access, {
                page: "1",
                numero_documento: trimmed,
            })

            const results = data.results ?? []
            if (results.length === 0) return null

            const exact = results.find((persona) => persona.numero_documento === trimmed)
            return exact ?? results[0]
        },
    })
}

export default useLookupPersonaByDocumento
