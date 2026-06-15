import type { Documento } from "../../../services/taxes/documentosService"
import type { CreateUpdatePersona, Persona } from "../../../services/taxes/personasService"
import { toDateInputValue } from "../../../utils/formatLocalDate"

export type PersonaDocumentKind = "dni" | "ruc" | "other"

export interface PersonaFormValues {
    documento: number
    numero_documento: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    razon_social: string
    nombre_comercial: string
    fecha_nacimiento: string
    direccion: string
    email: string
}

export const emptyPersonaFormValues: PersonaFormValues = {
    documento: 0,
    numero_documento: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    razon_social: "",
    nombre_comercial: "",
    fecha_nacimiento: "",
    direccion: "",
    email: "",
}

export const getDefaultPersonaFechaNacimiento = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export const isPersonaJuridica = (kind: PersonaDocumentKind): boolean => kind === "ruc"

export const isPersonaJuridicaRecord = (persona: Persona): boolean =>
    persona.razon_social != null && persona.razon_social !== "0"

export const getDocumentKind = (
    documentoId: number,
    documentos: Documento[] = [],
): PersonaDocumentKind => {
    const doc = documentos.find((item) => item.id_documento === documentoId)
    if (!doc) return "other"

    const text = `${doc.abreviatura || ""} ${doc.descripcion || ""}`.toUpperCase()
    if (text.includes("DNI") || text.includes("DOCUMENTO NACIONAL")) return "dni"
    if (text.includes("RUC") || text.includes("REGISTRO UNICO") || text.includes("REGISTRO ÚNICO")) {
        return "ruc"
    }
    return "other"
}

export const sanitizeNumeroDocumento = (
    value: string,
    kind: PersonaDocumentKind,
): string => {
    if (kind === "dni") return value.replace(/\D/g, "").slice(0, 8)
    if (kind === "ruc") return value.replace(/\D/g, "").slice(0, 11)
    return value.trim()
}

export const validateNumeroDocumento = (
    value: string,
    kind: PersonaDocumentKind,
): string => {
    const trimmed = value.trim()
    if (!trimmed) return "El número de documento es obligatorio"

    if (kind === "dni") {
        if (!/^\d+$/.test(trimmed)) {
            return "El DNI solo debe contener números."
        }
        if (trimmed.length !== 8) {
            return "El DNI debe tener 8 dígitos."
        }
        return ""
    }

    if (kind === "ruc") {
        if (!/^\d+$/.test(trimmed)) {
            return "El RUC solo debe contener números."
        }
        if (trimmed.length !== 11) {
            return "El RUC debe tener 11 dígitos."
        }
        return ""
    }

    return ""
}

export const validateEmail = (value: string): string => {
    const trimmed = value.trim()
    if (!trimmed) return ""

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmed)) {
        return "Ingrese un correo electrónico válido."
    }
    return ""
}

export const buildNombreCompleto = (
    values: Pick<PersonaFormValues, "nombres" | "apellido_paterno" | "apellido_materno">,
): string =>
    [values.nombres, values.apellido_paterno, values.apellido_materno]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ")
        .toUpperCase()

export const personaToFormValues = (persona: Persona): PersonaFormValues => {
    const juridica = isPersonaJuridicaRecord(persona)

    return {
        documento: persona.documento || 0,
        numero_documento: persona.numero_documento || "",
        nombres: juridica ? "" : persona.nombres || "",
        apellido_paterno: juridica ? "" : persona.apellido_paterno || "",
        apellido_materno: juridica ? "" : persona.apellido_materno || "",
        razon_social: juridica ? persona.razon_social || "" : "",
        nombre_comercial:
            juridica && persona.nombre_comercial !== "0"
                ? persona.nombre_comercial || ""
                : "",
        fecha_nacimiento: toDateInputValue(persona.fecha_nacimiento),
        direccion: persona.direccion || "",
        email: persona.email && persona.email !== "-" ? persona.email : "",
    }
}

export const formValuesToPersonaPayload = (
    values: PersonaFormValues,
    documentKind: PersonaDocumentKind,
): CreateUpdatePersona => {
    if (isPersonaJuridica(documentKind)) {
        const razonSocial = values.razon_social.trim().toUpperCase()
        const nombreComercial = values.nombre_comercial.trim().toUpperCase()

        return {
            nombres: "0",
            apellido_paterno: "0",
            apellido_materno: "0",
            razon_social: razonSocial,
            nombre_comercial: nombreComercial || "0",
            documento: values.documento,
            numero_documento: values.numero_documento.trim(),
            direccion: values.direccion.trim().toUpperCase(),
            fecha_nacimiento:
                values.fecha_nacimiento.trim() || getDefaultPersonaFechaNacimiento(),
            nombre_completo: razonSocial,
            email: values.email.trim() || null,
        }
    }

    return {
        nombres: values.nombres.trim().toUpperCase(),
        apellido_paterno: values.apellido_paterno.trim().toUpperCase(),
        apellido_materno: values.apellido_materno.trim().toUpperCase(),
        razon_social: "0",
        nombre_comercial: "0",
        documento: values.documento,
        numero_documento: values.numero_documento.trim(),
        direccion: values.direccion.trim().toUpperCase(),
        fecha_nacimiento: values.fecha_nacimiento,
        nombre_completo: buildNombreCompleto(values),
        email: values.email.trim() || null,
    }
}

export const isMeaningfulDireccion = (
    value: string | null | undefined,
): value is string => {
    const trimmed = value?.trim()
    return !!trimmed && trimmed !== "0"
}

export const resolvePersonaDireccion = (
    persona: Pick<Persona, "direccion">,
    payload?: Pick<CreateUpdatePersona, "direccion">,
): string => {
    if (isMeaningfulDireccion(persona.direccion)) {
        return persona.direccion
    }
    if (payload?.direccion?.trim()) {
        return payload.direccion.trim()
    }
    return persona.direccion?.trim() || ""
}

export const enrichPersonaFromPayload = (
    persona: Persona,
    payload: CreateUpdatePersona,
): Persona => ({
    ...persona,
    numero_documento: persona.numero_documento || payload.numero_documento,
    nombre_completo: persona.nombre_completo || payload.nombre_completo,
    nombres: persona.nombres?.trim() ? persona.nombres : payload.nombres,
    apellido_paterno: persona.apellido_paterno?.trim()
        ? persona.apellido_paterno
        : payload.apellido_paterno,
    apellido_materno: persona.apellido_materno?.trim()
        ? persona.apellido_materno
        : payload.apellido_materno,
    razon_social:
        persona.razon_social?.trim() && persona.razon_social !== "0"
            ? persona.razon_social
            : payload.razon_social,
    nombre_comercial:
        persona.nombre_comercial?.trim() && persona.nombre_comercial !== "0"
            ? persona.nombre_comercial
            : payload.nombre_comercial,
    direccion: resolvePersonaDireccion(persona, payload),
    email: persona.email?.trim() && persona.email !== "-"
        ? persona.email
        : payload.email,
})

export const getPersonaBackendError = (error: unknown): string => {
    const data = (error as { response?: { data?: Record<string, unknown> } })
        ?.response?.data
    if (!data) {
        return error instanceof Error
            ? error.message
            : "No se pudo completar la operación."
    }
    if (typeof data.detail === "string") return data.detail
    if (typeof data.message === "string") return data.message
    const first = Object.values(data).find((v) => typeof v === "string")
    if (typeof first === "string") return first
    const firstArr = Object.values(data).find((v) => Array.isArray(v))
    if (Array.isArray(firstArr) && typeof firstArr[0] === "string") {
        return firstArr[0]
    }
    return "No se pudo completar la operación."
}
