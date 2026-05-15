import type { ActoCondicion, CreateActoCondicionPayload } from "../../../services/api/actoCondicionService"

export const labelClass = "text-xs font-semibold text-slate-700"
export const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
export const controlShellClass =
    "mt-1 flex min-h-[2.625rem] w-full items-center rounded-md border border-slate-300 bg-white px-3 disabled:cursor-not-allowed disabled:bg-slate-100"

export const UIF_OPTIONS = [
    { value: "", label: "Selecciona" },
    { value: "O", label: "O" },
    { value: "B", label: "B" },
    { value: "G", label: "G" },
    { value: "R", label: "R" },
    { value: "N", label: "N (Testigos, Interviniente)" },
] as const

export const MONTOP_OPTIONS = [
    { value: "", label: "Selecciona" },
    { value: "1", label: "SI" },
    { value: "0", label: "NO" },
] as const

export const PARTE_OPTIONS = [
    { value: "", label: "Selecciona" },
    { value: "1", label: "Transferente" },
    { value: "2", label: "Adquiriente" },
] as const

export type ActoCondicionFields = {
    condicion: string
    parte: string
    uif: string
    formularioChecked: boolean
    montop: string
    totorgante: string
    condicionsisgen: string
    codconsisgen: string
}

export const emptyActoCondicionFields = (): ActoCondicionFields => ({
    condicion: "",
    parte: "",
    uif: "",
    formularioChecked: false,
    montop: "",
    totorgante: "",
    condicionsisgen: "",
    codconsisgen: "",
})

/** API puede devolver `idcondicion` como número o con otro nombre de campo. */
export function resolveActoCondicionId(c: ActoCondicion): string {
    const raw =
        c.idcondicion ??
        (c as ActoCondicion & { id_condicion?: string | number }).id_condicion
    if (raw == null || raw === "") return ""
    return String(raw).trim()
}

export function normalizeActoCondicion(raw: ActoCondicion): ActoCondicion {
    return {
        ...raw,
        idcondicion: resolveActoCondicionId(raw),
        idtipoacto: String(raw.idtipoacto ?? "").trim(),
    }
}

export function actoCondicionToFields(c: ActoCondicion): ActoCondicionFields {
    return {
        condicion: c.condicion ?? "",
        parte: c.parte ?? "",
        uif: c.uif ?? "",
        formularioChecked: String(c.formulario ?? "").trim() === "1",
        montop: c.montop ?? "",
        totorgante: c.totorgante ?? "",
        condicionsisgen: c.condicionsisgen ?? "",
        codconsisgen: c.codconsisgen ?? "",
    }
}

export function fieldsToActoCondicionPayload(
    f: ActoCondicionFields,
    idtipoacto: string
): CreateActoCondicionPayload | null {
    const cond = f.condicion.trim()
    const idta = idtipoacto.trim()
    if (!idta || !cond) return null

    const body: CreateActoCondicionPayload = {
        idtipoacto: idta,
        condicion: cond,
    }
    if (f.parte) body.parte = f.parte
    if (f.uif) body.uif = f.uif
    if (f.formularioChecked) body.formulario = "1"
    if (f.montop) body.montop = f.montop
    const tot = f.totorgante.trim()
    if (tot) body.totorgante = tot
    const sisgen = f.condicionsisgen.trim()
    if (sisgen) body.condicionsisgen = sisgen
    const cod = f.codconsisgen.trim()
    if (cod) body.codconsisgen = cod
    return body
}

export function parteLabel(value: string | undefined): string {
    if (value === "1") return "Transferente"
    if (value === "2") return "Adquiriente"
    return value?.trim() ? value : "—"
}

export function montopLabel(value: string | undefined): string {
    if (value === "1") return "SI"
    if (value === "0") return "NO"
    return value?.trim() ? value : "—"
}

export function formularioLabel(value: string | undefined): string {
    return String(value ?? "").trim() === "1" ? "Sí" : "—"
}

export function mutationErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message) return err.message
    const data = (err as { response?: { data?: { detail?: unknown; message?: unknown } } })?.response?.data
    if (data?.detail != null) return String(data.detail)
    if (data?.message != null) return String(data.message)
    return fallback
}
