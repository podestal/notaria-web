/** Detect when a representante also carries other condiciones (e.g. comprador/vendedor). */

export const isRepresentanteCondicionLabel = (label: string) =>
    label.trim().toUpperCase() === "REPRESENTANTE"

export const parseCondicionLabels = (condicionStr?: string | null): string[] => {
    if (!condicionStr?.trim()) return []
    return condicionStr
        .split(/[/|,;]+/)
        .map((part) => part.trim())
        .filter(Boolean)
}

export type RepresentanteCondicionConflict = {
    hasRepresentante: boolean
    otherLabels: string[]
}

export const getRepresentanteCondicionConflict = (
    labels: string[],
): RepresentanteCondicionConflict => {
    const normalized = labels.map((label) => label.trim()).filter(Boolean)
    const hasRepresentante = normalized.some(isRepresentanteCondicionLabel)
    const otherLabels = normalized.filter((label) => !isRepresentanteCondicionLabel(label))
    return { hasRepresentante, otherLabels }
}

export const hasRepresentanteCondicionConflict = (labels: string[]) => {
    const { hasRepresentante, otherLabels } = getRepresentanteCondicionConflict(labels)
    return hasRepresentante && otherLabels.length > 0
}

export const formatOtherCondiciones = (otherLabels: string[]) => {
    if (otherLabels.length === 0) return ""
    if (otherLabels.length === 1) return otherLabels[0]
    if (otherLabels.length === 2) return `${otherLabels[0]} y ${otherLabels[1]}`
    return `${otherLabels.slice(0, -1).join(", ")} y ${otherLabels[otherLabels.length - 1]}`
}
