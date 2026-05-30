import { RepresentanteContratanteData } from '../services/api/contratantesService'
import { Representante } from '../services/api/representantesService'

/** 1 = inscrito (sí), 0 = no inscrito. Legacy DB may use "0", "2", "NO", etc. */
export const parseInscritoValue = (value?: string | null): number => {
    const normalized = String(value ?? '1').trim().toLowerCase()
    if (
        normalized === '0' ||
        normalized === '2' ||
        normalized === 'no' ||
        normalized === 'n'
    ) {
        return 0
    }
    return 1
}

export const parseSedeRegistralValue = (value?: string | null): number => {
    const parsed = parseInt(String(value ?? '0').trim(), 10)
    return Number.isNaN(parsed) || parsed <= 0 ? 0 : parsed
}

export const representanteToContratanteData = (
    rep: Representante
): RepresentanteContratanteData => ({
    facultades: rep.facultades ?? '',
    inscrito: rep.inscrito ?? '1',
    idsedereg: rep.sede_registral ?? '',
    numpartida: rep.partida ?? '',
})

/** Resolve idcontratante of the natural person acting as representative. */
export const resolveLinkedRepresentanteContratanteId = (
    linkedContratanteId: string | undefined,
    representante: Representante | null | undefined,
    contratantes: { idcontratante: string; cliente_id: string }[]
): string => {
    if (linkedContratanteId?.trim()) return linkedContratanteId.trim()

    const repClientId = representante?.idcontratante_r?.trim()
    if (!repClientId) return ''

    const byClient = contratantes.find((c) => c.cliente_id === repClientId)
    if (byClient) return byClient.idcontratante

    const byContratante = contratantes.find((c) => c.idcontratante === repClientId)
    return byContratante?.idcontratante ?? ''
}
