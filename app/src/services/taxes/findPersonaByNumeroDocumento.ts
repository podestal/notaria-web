import {
    normalizePersonasLookupResults,
    personasLookupService,
    personasService,
    type Persona,
} from "./personasService"

const normalizeDocumento = (value: string): string => value.replace(/\D/g, "")

export const extractLeadingDocumentNumber = (query: string): string => {
    const match = query.trim().match(/^(\d{8,11})/)
    return match?.[1] ?? ""
}

const matchesDocumento = (persona: Persona, numeroDocumento: string): boolean => {
    const target = normalizeDocumento(numeroDocumento)
    if (!target) return false
    return normalizeDocumento(persona.numero_documento || "") === target
}

export const findPersonaByNumeroDocumento = async (
    access: string,
    numeroDocumento: string,
): Promise<Persona | null> => {
    const trimmed = numeroDocumento.trim()
    if (!trimmed) return null

    const page = await personasService.get(access, {
        page: "1",
        numero_documento: trimmed,
    })
    const exactFromList = page.results?.find((persona) =>
        matchesDocumento(persona, trimmed),
    )
    if (exactFromList) return exactFromList

    const lookup = await personasLookupService.get(access, { q: trimmed })
    const results = normalizePersonasLookupResults(lookup)
    return results.find((persona) => matchesDocumento(persona, trimmed)) ?? null
}
