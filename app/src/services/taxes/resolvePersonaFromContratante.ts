import getCliente2Service from "../../services/api/clienteService"
import type { Documento } from "../../services/taxes/documentosService"
import {
    getPersonasServiceSingle,
    normalizePersonasLookupResults,
    personasLookupService,
    personasService,
    type CreateUpdatePersona,
    type Persona,
} from "../../services/taxes/personasService"
import { enrichPersonaFromPayload } from "../../components/taxes/personas/personaFormShared"
import { cliente2ToPersonaPayload } from "../../utils/taxes/cliente2ToPersonaPayload"

const findPersonaByDocumento = async (
    access: string,
    numeroDocumento: string,
): Promise<Persona | null> => {
    const trimmed = numeroDocumento.trim()
    if (!trimmed) return null

    const page = await personasService.get(access, {
        page: "1",
        numero_documento: trimmed,
    })
    const exactFromList = page.results?.find(
        (persona) => persona.numero_documento === trimmed,
    )
    if (exactFromList) return exactFromList

    const lookup = await personasLookupService.get(access, { q: trimmed })
    const results = normalizePersonasLookupResults(lookup)
    return results.find((persona) => persona.numero_documento === trimmed) ?? null
}

export const resolvePersonaFromContratante = async (
    access: string,
    idcontratante: string,
    documentos: Documento[] = [],
): Promise<{ persona: Persona; payload: CreateUpdatePersona; created: boolean }> => {
    const clienteService = getCliente2Service({ byContratante: true })
    const cliente = await clienteService.get(access, { idcontratante })
    const payload = cliente2ToPersonaPayload(cliente, documentos)

    if (!payload.numero_documento.trim()) {
        throw new Error("El contratante no tiene número de documento.")
    }

    const existing = await findPersonaByDocumento(access, payload.numero_documento)
    if (existing) {
        return {
            persona: enrichPersonaFromPayload(existing, payload),
            payload,
            created: false,
        }
    }

    const personasServiceSingle = getPersonasServiceSingle()
    const created = await personasServiceSingle.post(payload, access)

    return {
        persona: enrichPersonaFromPayload(created, payload),
        payload,
        created: true,
    }
}
