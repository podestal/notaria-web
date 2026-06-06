export const normalizeTaxesList = <T,>(
    data: T[] | { results: T[] } | undefined,
): T[] => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return data.results ?? []
}
