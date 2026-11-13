/** Shared display sorting for contratantes: empresa → representante → others, A–Z. */

export type ContratanteSide = "otorgante" | "beneficiario"

export type ContratanteDisplaySortable = {
    idcontratante: string
    cliente?: string
    tipper?: string
    tiporepresentacion?: string
    idcontratanterp?: string
    partes?: string[]
    uif_roles?: string[]
    parte?: string
    uif?: string
}

const normalizeTipper = (tipper?: string) => (tipper || "").trim().toUpperCase()

/** ids stored in idcontratanterp (may be one id or a joined list). */
export const parseIdContratanteRp = (raw?: string): string[] => {
    const value = (raw || "").trim()
    if (!value) return []
    return value
        .split(/[,;/|\s]+/)
        .map((part) => part.trim())
        .filter(Boolean)
}

export const isEmpresaContratante = (c: ContratanteDisplaySortable) =>
    normalizeTipper(c.tipper) === "J"

/**
 * Natural-person representante: referenced by another contratante's idcontratanterp,
 * or flagged UIF R (and not the empresa itself).
 */
export const isRepresentanteContratante = (
    c: ContratanteDisplaySortable,
    allItems: ContratanteDisplaySortable[] = [],
): boolean => {
    if (isEmpresaContratante(c)) return false
    const id = String(c.idcontratante || "").trim()
    if (id && allItems.some((other) => parseIdContratanteRp(other.idcontratanterp).includes(id))) {
        return true
    }
    const roles = (c.uif_roles || []).map((r) => r.toUpperCase())
    if (roles.includes("R")) return true
    if ((c.uif || "").trim().toUpperCase() === "R") return true
    return false
}

/** Role bucket inside a side: 0 empresa, 1 representante, 2 others. */
export const contratanteRoleRank = (
    c: ContratanteDisplaySortable,
    allItems: ContratanteDisplaySortable[] = [],
): number => {
    if (isEmpresaContratante(c)) return 0
    if (isRepresentanteContratante(c, allItems)) return 1
    return 2
}

export const contratanteSortName = (c: ContratanteDisplaySortable): string =>
    (c.cliente || "").trim().toLocaleLowerCase("es")

export const compareContratantesDisplay = (
    a: ContratanteDisplaySortable,
    b: ContratanteDisplaySortable,
    allItems: ContratanteDisplaySortable[] = [],
): number => {
    const rank = contratanteRoleRank(a, allItems) - contratanteRoleRank(b, allItems)
    if (rank !== 0) return rank
    const byName = contratanteSortName(a).localeCompare(contratanteSortName(b), "es", {
        sensitivity: "base",
    })
    if (byName !== 0) return byName
    return String(a.idcontratante).localeCompare(String(b.idcontratante))
}

export const sortContratantesDisplay = <T extends ContratanteDisplaySortable>(
    items: T[],
    allItems: ContratanteDisplaySortable[] = items,
): T[] => [...items].sort((a, b) => compareContratantesDisplay(a, b, allItems))

const hasParte = (c: ContratanteDisplaySortable, value: string) => {
    if ((c.parte || "").trim() === value) return true
    return (c.partes || []).some((p) => String(p).trim() === value)
}

const hasUif = (c: ContratanteDisplaySortable, value: string) => {
    const needle = value.toUpperCase()
    if ((c.uif || "").trim().toUpperCase() === needle) return true
    return (c.uif_roles || []).some((r) => String(r).trim().toUpperCase() === needle)
}

/** Direct side from condición / CXA (ignore UIF R — that only marks representante). */
export const directContratanteSides = (c: ContratanteDisplaySortable): ContratanteSide[] => {
    const sides: ContratanteSide[] = []
    if (hasParte(c, "1") || hasUif(c, "O")) sides.push("otorgante")
    if (hasParte(c, "2") || hasUif(c, "B")) sides.push("beneficiario")
    return sides
}

/**
 * Representantes inherit the side of who they represent (via idcontratanterp on that party).
 * No "otros" bucket — everyone lands under Otorgantes and/or Beneficiarios when resolvable.
 */
export const groupContratantesBySide = <T extends ContratanteDisplaySortable>(items: T[]) => {
    const list = Array.isArray(items) ? items : []
    const byId = new Map<string, T>()
    for (const item of list) {
        const id = String(item.idcontratante || "").trim()
        if (id) byId.set(id, item)
    }

    /** whoDoesThisPersonRepresent: repId -> represented party ids */
    const representedByRep = new Map<string, Set<string>>()
    for (const item of list) {
        const representedId = String(item.idcontratante || "").trim()
        for (const repId of parseIdContratanteRp(item.idcontratanterp)) {
            if (!representedByRep.has(repId)) representedByRep.set(repId, new Set())
            if (representedId) representedByRep.get(repId)!.add(representedId)
        }
    }

    const directSides = new Map<string, Set<ContratanteSide>>()
    for (const item of list) {
        const id = String(item.idcontratante || "").trim()
        if (!id) continue
        directSides.set(id, new Set(directContratanteSides(item)))
    }

    const resolveSides = (id: string, visiting = new Set<string>()): Set<ContratanteSide> => {
        if (visiting.has(id)) return new Set()
        visiting.add(id)

        const own = new Set(directSides.get(id) || [])
        if (own.size > 0) return own

        const representedIds = representedByRep.get(id)
        if (representedIds) {
            for (const representedId of representedIds) {
                for (const side of resolveSides(representedId, visiting)) {
                    own.add(side)
                }
            }
        }

        // Rare: this row points at someone else and has no own side — follow that party.
        const self = byId.get(id)
        if (own.size === 0 && self) {
            for (const otherId of parseIdContratanteRp(self.idcontratanterp)) {
                for (const side of resolveSides(otherId, visiting)) {
                    own.add(side)
                }
            }
        }

        return own
    }

    const otorgantes: T[] = []
    const beneficiarios: T[] = []
    const seenO = new Set<string>()
    const seenB = new Set<string>()

    for (const item of list) {
        const id = String(item.idcontratante || "").trim()
        if (!id) continue
        const sides = resolveSides(id)
        if (sides.has("otorgante") && !seenO.has(id)) {
            seenO.add(id)
            otorgantes.push(item)
        }
        if (sides.has("beneficiario") && !seenB.has(id)) {
            seenB.add(id)
            beneficiarios.push(item)
        }
    }

    return {
        otorgantes: sortContratantesDisplay(otorgantes, list),
        beneficiarios: sortContratantesDisplay(beneficiarios, list),
    }
}
