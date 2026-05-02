/** Normalizes cliente / domiciliario sexo to `M`, `F`, or empty for the certificado form. */
export function mapToGeneroMF(raw: unknown): "" | "M" | "F" {
    if (raw === null || raw === undefined || raw === "") return ""
    const s = String(raw).trim()
    const u = s.toUpperCase()
    if (u === "M" || u === "MASCULINO" || u === "H" || u === "1" || u === "HOMBRE") return "M"
    if (u === "F" || u === "FEMENINO" || u === "2" || u === "MUJER") return "F"
    if (u.includes("MASCUL")) return "M"
    if (u.includes("FEMEN")) return "F"
    return ""
}
